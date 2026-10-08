from typing import Dict, Any, List, Optional


def detect_opportunities(
    analytics: Dict[str, Any],
    growth_score_res: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Detects deterministic, actionable business opportunities using computed analytics and Growth Score.
    Deduplicates by (category, problem) and orders by priority, impact, and confidence.
    """
    opportunities: List[Dict[str, Any]] = []

    fin = analytics.get("financial", {})
    cust = analytics.get("customers", {})
    inv = analytics.get("inventory", {})
    mkt = analytics.get("marketing", {})
    sales = analytics.get("sales", {})

    total_rev = fin.get("total_revenue", 0.0)
    rev_growth = fin.get("revenue_growth")
    margin = fin.get("profit_margin")
    total_exp = fin.get("total_expenses", 0.0)

    total_cust = cust.get("total_customers", 0)
    repeat_rate = cust.get("repeat_customer_rate", 0.0)
    repeat_cust = cust.get("repeat_customers", 0)

    total_prods = inv.get("total_products", 0)
    low_stock = inv.get("low_stock_products", 0)
    out_of_stock = inv.get("out_of_stock_products", 0)
    inv_val = inv.get("inventory_value", 0.0)

    mkt_spend = mkt.get("marketing_spend", 0.0)
    roas = mkt.get("roas", 0.0)
    conv_rate = mkt.get("conversion_rate", 0.0)
    mkt_rev = mkt.get("marketing_revenue", 0.0)

    # Rule 1: Declining Revenue
    if rev_growth is not None and rev_growth < 0:
        opportunities.append({
            "id": "opp_revenue_declining",
            "title": "Recover Declining Revenue Trajectory",
            "category": "Revenue Growth",
            "priority": "critical" if rev_growth < -10 else "high",
            "problem": "Revenue declined compared to previous period.",
            "evidence": f"Revenue growth rate is {rev_growth:.1f}% (Total Revenue: ${total_rev:,.2f}).",
            "reasoning": "Recent sales transactions demonstrate a downward momentum compared to the baseline period.",
            "recommended_action": "Re-engage recent lapsed customers with targeted win-back campaigns and review top product stock availability.",
            "expected_impact": f"Potential revenue recovery of ${abs(total_rev * (rev_growth / 100)):,.2f}.",
            "difficulty": "moderate",
            "confidence": 0.9,
            "related_module": "financials"
        })

    # Rule 2: Low or Negative Profit Margin
    if margin is not None and margin < 10.0:
        is_negative = margin < 0
        opportunities.append({
            "id": "opp_profitability_margin",
            "title": "Optimize Operating Profit Margin",
            "category": "Profitability",
            "priority": "critical" if is_negative else "high",
            "problem": "Operating profit margin is below target healthy baseline." if not is_negative else "Business is operating at a net loss.",
            "evidence": f"Net profit margin is {margin:.1f}% (Net Profit: ${fin.get('net_profit', 0.0):,.2f}, Expenses: ${total_exp:,.2f}).",
            "reasoning": "High overhead or cost of goods sold is eroding transaction profitability.",
            "recommended_action": "Audit top expense categories, renegotiate supplier unit costs, and adjust pricing on low-margin items.",
            "expected_impact": f"Expanding margin by 5% adds ${total_rev * 0.05:,.2f} to bottom line profit.",
            "difficulty": "moderate",
            "confidence": 0.95,
            "related_module": "financials"
        })

    # Rule 3: Low Repeat Customer Rate / High Retention Opportunity
    if total_cust >= 5:
        if repeat_rate < 20.0:
            opportunities.append({
                "id": "opp_customer_retention_low",
                "title": "Boost Customer Repeat Purchase Rate",
                "category": "Customer Retention",
                "priority": "high",
                "problem": "Repeat customer rate is low.",
                "evidence": f"Repeat customer rate is {repeat_rate:.1f}% ({repeat_cust} repeat customers out of {total_cust} total).",
                "reasoning": "Acquiring new customers is 5x more expensive than retaining existing ones. Current repeat rate indicates missed repeat revenue.",
                "recommended_action": "Launch an automated post-purchase email follow-up sequence and introduce a customer loyalty incentive.",
                "expected_impact": f"Increasing repeat rate to 30% generates ~{(total_cust * 0.1):.0f} additional repeat orders.",
                "difficulty": "easy",
                "confidence": 0.85,
                "related_module": "customers"
            })
        elif repeat_rate >= 35.0:
            opportunities.append({
                "id": "opp_customer_retention_high",
                "title": "Capitalize on High Customer Loyalty",
                "category": "Customer Retention",
                "priority": "medium",
                "problem": "High repeat customer loyalty can be monetized further.",
                "evidence": f"Strong repeat customer rate of {repeat_rate:.1f}% ({repeat_cust} repeat buyers).",
                "reasoning": "Existing loyal customer base presents strong upsell and cross-sell potential.",
                "recommended_action": "Create VIP bundle offers and VIP early-access product releases for top returning customers.",
                "expected_impact": "Increase Average Order Value (AOV) among repeat customers by 15-25%.",
                "difficulty": "easy",
                "confidence": 0.9,
                "related_module": "customers"
            })

    # Rule 4: Out of Stock Products (Lost Sales Risk)
    if out_of_stock > 0:
        opportunities.append({
            "id": "opp_inventory_out_of_stock",
            "title": "Prevent Lost Revenue from Out-of-Stock Items",
            "category": "Inventory",
            "priority": "critical" if out_of_stock >= 3 else "high",
            "problem": "Out of stock products causing immediate lost sales.",
            "evidence": f"{out_of_stock} out of stock products detected out of {total_prods} total SKUs.",
            "reasoning": "Customers attempting to purchase unavailable SKUs bounce or buy from competitors.",
            "recommended_action": "Expedite purchase reorders for zero-stock products and set up automated reorder threshold triggers.",
            "expected_impact": f"Restocking active catalog recovers up to 10-15% of missed order volume.",
            "difficulty": "easy",
            "confidence": 0.95,
            "related_module": "inventory"
        })

    # Rule 5: Low Stock Products (Inventory Planning)
    if low_stock > 0:
        opportunities.append({
            "id": "opp_inventory_low_stock",
            "title": "Restock Low Inventory Items Before Stockout",
            "category": "Inventory",
            "priority": "medium",
            "problem": "Low stock products approaching stockout threshold.",
            "evidence": f"{low_stock} products currently flagged as low stock.",
            "reasoning": "Proactive replenishment ensures uninterrupted order fulfillment.",
            "recommended_action": "Review inventory velocity and issue supplier purchase orders for low-stock SKUs.",
            "expected_impact": "Maintain 99%+ order fulfillment reliability.",
            "difficulty": "easy",
            "confidence": 0.9,
            "related_module": "inventory"
        })

    # Rule 6: High Marketing ROAS (Scale Successful Marketing)
    if mkt_spend > 0 and roas >= 2.0:
        opportunities.append({
            "id": "opp_marketing_scale_roas",
            "title": "Scale High-Performing Marketing Channels",
            "category": "Marketing",
            "priority": "high",
            "problem": "Marketing channels are generating strong ROI but underfunded.",
            "evidence": f"Marketing ROAS is {roas:.2f}x (Attributed Revenue: ${mkt_rev:,.2f} on ${mkt_spend:,.2f} spend).",
            "reasoning": "Campaign returns are significantly higher than cost, indicating profitable room to scale budget.",
            "recommended_action": "Increase ad budget on top-performing campaigns by 20-30% while monitoring ROAS stability.",
            "expected_impact": f"Estimated additional attributed revenue of ${mkt_spend * 0.3 * roas:,.2f}.",
            "difficulty": "easy",
            "confidence": 0.85,
            "related_module": "marketing"
        })

    # Rule 7: Weak Marketing Conversion / Unprofitable Spend
    if mkt_spend > 0 and roas < 1.0:
        opportunities.append({
            "id": "opp_marketing_optimize_unprofitable",
            "title": "Optimize or Reallocate Unprofitable Ad Spend",
            "category": "Marketing",
            "priority": "high",
            "problem": "Marketing spend is returning less revenue than campaign costs.",
            "evidence": f"ROAS is {roas:.2f}x (<1.0x) on ${mkt_spend:,.2f} marketing spend.",
            "reasoning": "Current marketing channels are consuming cash without generating profitable customer acquisition.",
            "recommended_action": "Pause low-converting ad sets, refine audience targeting, and optimize landing page conversion rates.",
            "expected_impact": f"Eliminate up to ${mkt_spend:,.2f} in wasted ad spend or redirect to profitable channels.",
            "difficulty": "moderate",
            "confidence": 0.9,
            "related_module": "marketing"
        })

    # Deduplication by (category, problem)
    seen_keys = set()
    deduped_opportunities = []
    for opp in opportunities:
        key = (opp["category"], opp["problem"])
        if key not in seen_keys:
            seen_keys.add(key)
            deduped_opportunities.append(opp)

    # Sort Priority order mapping
    priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}

    deduped_opportunities.sort(
        key=lambda x: (
            priority_order.get(x["priority"], 99),
            -x["confidence"]
        )
    )

    return deduped_opportunities
