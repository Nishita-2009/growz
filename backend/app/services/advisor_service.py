import json
import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import Business
from app.services.analytics_service import generate_business_analytics
from app.services.growth_score_service import calculate_growth_score
from app.services.opportunity_service import detect_opportunities
from app.schemas.advisor import AdvisorRequest, AdvisorResponse, RawGeminiAdvisorResponse
from app.ai.provider import BaseAIProvider, AIProviderError
from app.ai.gemini_provider import GeminiProvider

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = (
    "You are Growz, an AI business growth advisor for MSMEs.\n\n"
    "Help the business owner understand what is happening in their business and decide what to do next.\n\n"
    "Use only the business facts provided in the context.\n\n"
    "Never invent, estimate, or fabricate business metrics.\n\n"
    "Clearly distinguish:\n"
    "- Facts\n"
    "- Interpretation\n"
    "- Recommendation\n\n"
    "If the available data is insufficient, say so explicitly.\n\n"
    "Prioritize the highest-impact existing opportunities.\n\n"
    "Give practical actions that an MSME owner can realistically take.\n\n"
    "Do not provide generic advice when specific business evidence is available.\n\n"
    "Keep responses concise, clear, and actionable.\n\n"
    "IMPORTANT: Return your response MUST strictly be a JSON object with the following schema:\n"
    "{\n"
    '  "answer": "Clear explanation answering the question",\n'
    '  "key_facts": ["Fact 1 based on context", "Fact 2 based on context"],\n'
    '  "recommended_action": "Single high-impact actionable recommendation",\n'
    '  "related_opportunity_id": "opp-id-or-null",\n'
    '  "confidence": "high"\n'
    "}"
)

def build_business_context(business: Business, analytics: Dict[str, Any], growth_score: Dict[str, Any], opportunities: list) -> Dict[str, Any]:
    context = {
        "business": {
            "name": business.name,
            "type": getattr(business, "business_type", "General MSME") or "General MSME"
        }
    }

    fin = analytics.get("financials", {})
    if fin.get("data_status") != "no_data":
        context["financial"] = {
            "revenue": fin.get("total_revenue"),
            "expenses": fin.get("total_expenses"),
            "net_profit": fin.get("net_profit"),
            "profit_margin": fin.get("profit_margin"),
            "revenue_growth": fin.get("revenue_growth"),
            "average_order_value": fin.get("average_order_value")
        }

    cust = analytics.get("customers", {})
    if cust.get("data_status") != "no_data":
        context["customers"] = {
            "total_customers": cust.get("total_customers"),
            "new_customers": cust.get("new_customers"),
            "repeat_customers": cust.get("repeat_customers"),
            "repeat_customer_rate": cust.get("repeat_customer_rate"),
            "customer_revenue": cust.get("customer_revenue")
        }

    sales = analytics.get("sales", {})
    if sales.get("data_status") != "no_data":
        context["sales"] = {
            "total_orders": sales.get("total_orders"),
            "units_sold": sales.get("total_units_sold"),
            "top_products": sales.get("top_products", [])[:3]
        }

    inv = analytics.get("inventory", {})
    if inv.get("data_status") != "no_data":
        context["inventory"] = {
            "total_products": inv.get("total_products"),
            "total_stock": inv.get("total_stock_items"),
            "low_stock_products": inv.get("low_stock_count"),
            "out_of_stock_products": inv.get("out_of_stock_count"),
            "inventory_value": inv.get("total_inventory_value")
        }

    mkt = analytics.get("marketing", {})
    if mkt.get("data_status") != "no_data":
        context["marketing"] = {
            "marketing_spend": mkt.get("total_spend"),
            "leads": mkt.get("total_leads"),
            "conversions": mkt.get("total_conversions"),
            "conversion_rate": mkt.get("conversion_rate"),
            "marketing_revenue": mkt.get("marketing_revenue"),
            "roas": mkt.get("roas")
        }

    opp_list = []
    for o in opportunities:
        if isinstance(o, dict):
            opp_list.append({
                "id": o.get("id"),
                "title": o.get("title"),
                "priority": o.get("priority"),
                "problem": o.get("problem"),
                "evidence": o.get("evidence"),
                "recommended_action": o.get("recommended_action")
            })
        else:
            opp_list.append({
                "id": getattr(o, "id", None),
                "title": getattr(o, "title", None),
                "priority": getattr(o, "priority", None),
                "problem": getattr(o, "problem", None),
                "evidence": getattr(o, "evidence", None),
                "recommended_action": getattr(o, "recommended_action", None)
            })

    categories_formatted = []
    for c in growth_score.get("categories", []):
        if isinstance(c, dict):
            categories_formatted.append({"category": c.get("category"), "score": c.get("score"), "status": c.get("status")})
        else:
            categories_formatted.append({"category": getattr(c, "category", None), "score": getattr(c, "score", None), "status": getattr(c, "status", None)})

    context["intelligence"] = {
        "overall_growth_score": growth_score.get("overall_score"),
        "confidence": growth_score.get("confidence"),
        "categories": categories_formatted,
        "top_opportunities": opp_list[:3]
    }

    return context

def ask_advisor(db: Session, business: Business, request: AdvisorRequest, ai_provider: Optional[BaseAIProvider] = None) -> AdvisorResponse:
    if ai_provider is None:
        ai_provider = GeminiProvider()

    analytics = generate_business_analytics(db, business)
    growth_score = calculate_growth_score(analytics)
    opportunities = detect_opportunities(analytics, growth_score)

    context = build_business_context(business, analytics, growth_score, opportunities)

    prompt = f"BUSINESS CONTEXT:\n{json.dumps(context, indent=2)}\n\nUSER QUESTION:\n{request.question}"

    try:
        raw_text = ai_provider.generate_business_advice(prompt, system_instruction=SYSTEM_INSTRUCTION)
        cleaned_text = raw_text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        cleaned_text = cleaned_text.strip()

        parsed_json = json.loads(cleaned_text)
        validated = RawGeminiAdvisorResponse(**parsed_json)

        return AdvisorResponse(
            question=request.question,
            answer=validated.answer,
            key_facts=validated.key_facts,
            recommended_action=validated.recommended_action,
            related_opportunity_id=validated.related_opportunity_id,
            confidence=validated.confidence
        )
    except json.JSONDecodeError:
        logger.error("Failed to parse Gemini response as JSON")
        return AdvisorResponse(
            question=request.question,
            answer="Growz AI analyzed your business data, but returned an unstructured response. Please review your top opportunities on the Opportunities page.",
            key_facts=["Real business metrics were calculated successfully."],
            recommended_action="Check the Opportunities tab for prioritized growth actions.",
            related_opportunity_id=opportunities[0].get("id") if opportunities and isinstance(opportunities[0], dict) else (getattr(opportunities[0], "id", None) if opportunities else None),
            confidence="medium"
        )
    except Exception as e:
        if isinstance(e, AIProviderError):
            raise e
        logger.error(f"Unexpected advisor error: {str(e)}")
        raise AIProviderError(f"AI Advisor processing failed: {str(e)}")
