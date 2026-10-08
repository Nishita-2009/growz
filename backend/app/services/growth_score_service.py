from typing import Dict, Any, List, Optional
import math

# Default category weights configuration (Must sum to 1.0 or 100%)
DEFAULT_CATEGORY_WEIGHTS: Dict[str, float] = {
    "Revenue Growth": 0.20,
    "Profitability": 0.20,
    "Customer Growth": 0.15,
    "Customer Retention": 0.15,
    "Marketing": 0.10,
    "Inventory": 0.10,
    "Operations": 0.05,
    "Cash Flow": 0.05,
}

# Threshold configuration for deterministic scoring rules
SCORE_THRESHOLDS = {
    "revenue_growth": {
        "strong_growth": 15.0,   # >= 15% growth -> Excellent (90-100)
        "moderate_growth": 5.0,  # >= 5% growth -> Healthy (70-89)
        "flat": -5.0,            # >= -5% growth -> Attention (50-69)
                                 # < -5% growth -> Critical (<50)
    },
    "profit_margin": {
        "healthy_margin": 20.0,  # >= 20% margin -> Excellent (90-100)
        "moderate_margin": 10.0, # >= 10% margin -> Healthy (70-89)
        "low_margin": 0.0,       # >= 0% margin -> Attention (50-69)
                                 # < 0% margin (loss) -> Critical (<50)
    },
    "customer_growth": {
        "strong_growth": 20.0,
        "moderate_growth": 5.0,
        "flat": 0.0,
    },
    "repeat_customer_rate": {
        "high_retention": 40.0,  # >= 40% repeat rate -> Excellent (90-100)
        "good_retention": 20.0,  # >= 20% repeat rate -> Healthy (70-89)
        "low_retention": 10.0,   # >= 10% repeat rate -> Attention (50-69)
                                 # < 10% repeat rate -> Critical (<50)
    },
    "marketing_roas": {
        "strong_roas": 3.0,     # >= 3.0x -> Excellent (90-100)
        "good_roas": 1.5,       # >= 1.5x -> Healthy (70-89)
        "break_even": 1.0,      # >= 1.0x -> Attention (50-69)
                                # < 1.0x -> Critical (<50)
    },
    "inventory": {
        "max_risk_ratio": 0.30, # >30% stock at low/out -> Critical/Attention
    }
}


def _evaluate_revenue_growth(analytics: Dict[str, Any]) -> Dict[str, Any]:
    fin = analytics.get("financial", {})
    rev_growth = fin.get("revenue_growth")
    total_rev = fin.get("total_revenue", 0.0)

    if total_rev == 0 and rev_growth is None:
        return {
            "category": "Revenue Growth",
            "score": None,
            "status": "insufficient_data",
            "data_status": "insufficient_data",
            "explanation": "Insufficient order history to calculate revenue growth baseline."
        }

    if rev_growth is None:
        # We have revenue but no prior 30d period for comparison
        return {
            "category": "Revenue Growth",
            "score": 70.0,
            "status": "healthy",
            "data_status": "sufficient",
            "explanation": f"Initial revenue baseline established (Total Revenue: ${total_rev:,.2f}). Comparative period needed for growth rate."
        }

    if rev_growth >= SCORE_THRESHOLDS["revenue_growth"]["strong_growth"]:
        score = min(100.0, 85.0 + (rev_growth - 15.0) * 0.5)
        status = "excellent"
        explanation = f"Strong revenue growth of +{rev_growth:.1f}% compared to previous period."
    elif rev_growth >= SCORE_THRESHOLDS["revenue_growth"]["moderate_growth"]:
        score = 70.0 + (rev_growth - 5.0) * 1.5
        status = "healthy"
        explanation = f"Healthy revenue growth of +{rev_growth:.1f}% compared to previous period."
    elif rev_growth >= SCORE_THRESHOLDS["revenue_growth"]["flat"]:
        score = 50.0 + (rev_growth + 5.0) * 2.0
        status = "attention"
        explanation = f"Flat revenue trajectory ({rev_growth:.1f}%) compared to previous period."
    else:
        score = max(10.0, 45.0 + rev_growth)  # rev_growth is negative
        status = "critical"
        explanation = f"Revenue declined by {abs(rev_growth):.1f}% compared to previous period."

    return {
        "category": "Revenue Growth",
        "score": round(score, 1),
        "status": status,
        "data_status": "sufficient",
        "explanation": explanation
    }


def _evaluate_profitability(analytics: Dict[str, Any]) -> Dict[str, Any]:
    fin = analytics.get("financial", {})
    margin = fin.get("profit_margin")
    total_rev = fin.get("total_revenue", 0.0)

    if total_rev == 0 and margin is None:
        return {
            "category": "Profitability",
            "score": None,
            "status": "insufficient_data",
            "data_status": "insufficient_data",
            "explanation": "No financial orders or expenses logged to evaluate profit margin."
        }

    if margin is None:
        return {
            "category": "Profitability",
            "score": None,
            "status": "insufficient_data",
            "data_status": "insufficient_data",
            "explanation": "Requires non-zero total revenue to compute net profit margin."
        }

    if margin >= SCORE_THRESHOLDS["profit_margin"]["healthy_margin"]:
        score = min(100.0, 85.0 + (margin - 20.0) * 0.5)
        status = "excellent"
        explanation = f"Excellent net profit margin of {margin:.1f}%."
    elif margin >= SCORE_THRESHOLDS["profit_margin"]["moderate_margin"]:
        score = 70.0 + (margin - 10.0) * 1.5
        status = "healthy"
        explanation = f"Healthy net profit margin of {margin:.1f}%."
    elif margin >= SCORE_THRESHOLDS["profit_margin"]["low_margin"]:
        score = 50.0 + margin * 2.0
        status = "attention"
        explanation = f"Thin profit margin of {margin:.1f}%. Operating close to break-even."
    else:
        score = max(5.0, 45.0 + margin * 1.5)
        status = "critical"
        explanation = f"Operating at a loss with a negative profit margin of {margin:.1f}%."

    return {
        "category": "Profitability",
        "score": round(score, 1),
        "status": status,
        "data_status": "sufficient",
        "explanation": explanation
    }


def _evaluate_customer_growth(analytics: Dict[str, Any]) -> Dict[str, Any]:
    cust = analytics.get("customers", {})
    total_cust = cust.get("total_customers", 0)
    new_cust = cust.get("new_customers", 0)

    if total_cust == 0:
        return {
            "category": "Customer Growth",
            "score": None,
            "status": "insufficient_data",
            "data_status": "insufficient_data",
            "explanation": "No customer profiles found in database."
        }

    new_ratio = (new_cust / total_cust) * 100 if total_cust > 0 else 0.0

    if new_ratio >= 25.0:
        score = min(100.0, 85.0 + (new_ratio - 25.0) * 0.3)
        status = "excellent"
        explanation = f"Strong acquisition momentum with {new_cust} new customers ({new_ratio:.1f}% of total)."
    elif new_ratio >= 10.0:
        score = 70.0 + (new_ratio - 10.0) * 1.0
        status = "healthy"
        explanation = f"Healthy customer addition with {new_cust} new customers ({new_ratio:.1f}% of total)."
    elif new_ratio > 0:
        score = 50.0 + new_ratio * 2.0
        status = "attention"
        explanation = f"Low new customer acquisition rate ({new_cust} new customers added)."
    else:
        score = 40.0
        status = "attention"
        explanation = "No new customers added in the recent period."

    return {
        "category": "Customer Growth",
        "score": round(score, 1),
        "status": status,
        "data_status": "sufficient",
        "explanation": explanation
    }


def _evaluate_customer_retention(analytics: Dict[str, Any]) -> Dict[str, Any]:
    cust = analytics.get("customers", {})
    total_cust = cust.get("total_customers", 0)
    repeat_rate = cust.get("repeat_customer_rate", 0.0)
    repeat_cust = cust.get("repeat_customers", 0)

    if total_cust == 0:
        return {
            "category": "Customer Retention",
            "score": None,
            "status": "insufficient_data",
            "data_status": "insufficient_data",
            "explanation": "No customer order history available to evaluate retention."
        }

    if repeat_rate >= SCORE_THRESHOLDS["repeat_customer_rate"]["high_retention"]:
        score = min(100.0, 85.0 + (repeat_rate - 40.0) * 0.4)
        status = "excellent"
        explanation = f"Outstanding customer retention with a {repeat_rate:.1f}% repeat customer rate ({repeat_cust} repeat customers)."
    elif repeat_rate >= SCORE_THRESHOLDS["repeat_customer_rate"]["good_retention"]:
        score = 70.0 + (repeat_rate - 20.0) * 0.75
        status = "healthy"
        explanation = f"Good repeat customer rate of {repeat_rate:.1f}%."
    elif repeat_rate >= SCORE_THRESHOLDS["repeat_customer_rate"]["low_retention"]:
        score = 50.0 + (repeat_rate - 10.0) * 2.0
        status = "attention"
        explanation = f"Moderate repeat rate of {repeat_rate:.1f}%. Room for loyalty growth."
    else:
        score = max(15.0, 30.0 + repeat_rate * 1.5)
        status = "critical" if repeat_rate < 5.0 else "attention"
        explanation = f"Low repeat customer rate of {repeat_rate:.1f}%. High customer churn risk."

    return {
        "category": "Customer Retention",
        "score": round(score, 1),
        "status": status,
        "data_status": "sufficient",
        "explanation": explanation
    }


def _evaluate_marketing(analytics: Dict[str, Any]) -> Dict[str, Any]:
    mkt = analytics.get("marketing", {})
    spend = mkt.get("marketing_spend", 0.0)
    roas = mkt.get("roas", 0.0)
    conv_rate = mkt.get("conversion_rate", 0.0)

    if spend == 0 and roas == 0 and conv_rate == 0:
        return {
            "category": "Marketing",
            "score": None,
            "status": "insufficient_data",
            "data_status": "insufficient_data",
            "explanation": "No active marketing spend or campaign records logged."
        }

    if roas >= SCORE_THRESHOLDS["marketing_roas"]["strong_roas"]:
        score = min(100.0, 85.0 + (roas - 3.0) * 3.0)
        status = "excellent"
        explanation = f"High marketing efficiency with a ROAS of {roas:.2f}x and {conv_rate:.1f}% conversion rate."
    elif roas >= SCORE_THRESHOLDS["marketing_roas"]["good_roas"]:
        score = 70.0 + (roas - 1.5) * 10.0
        status = "healthy"
        explanation = f"Positive marketing return with a ROAS of {roas:.2f}x."
    elif roas >= SCORE_THRESHOLDS["marketing_roas"]["break_even"]:
        score = 50.0 + (roas - 1.0) * 40.0
        status = "attention"
        explanation = f"Marketing near break-even with a ROAS of {roas:.2f}x."
    else:
        score = max(10.0, roas * 40.0)
        status = "critical"
        explanation = f"Unprofitable marketing spend with a ROAS of {roas:.2f}x (<1.0x)."

    return {
        "category": "Marketing",
        "score": round(score, 1),
        "status": status,
        "data_status": "sufficient",
        "explanation": explanation
    }


def _evaluate_inventory(analytics: Dict[str, Any]) -> Dict[str, Any]:
    inv = analytics.get("inventory", {})
    total_prods = inv.get("total_products", 0)
    low_stock = inv.get("low_stock_products", 0)
    out_of_stock = inv.get("out_of_stock_products", 0)

    if total_prods == 0:
        return {
            "category": "Inventory",
            "score": None,
            "status": "insufficient_data",
            "data_status": "insufficient_data",
            "explanation": "No product inventory catalog records logged."
        }

    risk_count = low_stock + out_of_stock
    risk_ratio = risk_count / total_prods if total_prods > 0 else 0.0

    if risk_count == 0:
        score = 95.0
        status = "excellent"
        explanation = f"Optimal inventory health across all {total_prods} products."
    elif risk_ratio <= 0.10:
        score = 80.0
        status = "healthy"
        explanation = f"Healthy inventory levels with {risk_count} items requiring stock reorders."
    elif risk_ratio <= 0.25:
        score = 60.0
        status = "attention"
        explanation = f"Inventory attention required: {low_stock} low stock, {out_of_stock} out of stock."
    else:
        score = max(15.0, 50.0 - risk_ratio * 80.0)
        status = "critical"
        explanation = f"Severe stock risk: {out_of_stock} products out of stock and {low_stock} low on stock."

    return {
        "category": "Inventory",
        "score": round(score, 1),
        "status": status,
        "data_status": "sufficient",
        "explanation": explanation
    }


def _evaluate_operations(analytics: Dict[str, Any]) -> Dict[str, Any]:
    sales = analytics.get("sales", {})
    total_orders = sales.get("total_orders", 0)

    if total_orders == 0:
        return {
            "category": "Operations",
            "score": None,
            "status": "insufficient_data",
            "data_status": "insufficient_data",
            "explanation": "No order fulfillment or operational transaction records."
        }

    if total_orders >= 50:
        score = 85.0
        status = "healthy"
        explanation = f"Active fulfillment operations with {total_orders} processed orders."
    elif total_orders >= 10:
        score = 70.0
        status = "healthy"
        explanation = f"Steady fulfillment flow with {total_orders} processed orders."
    else:
        score = 55.0
        status = "attention"
        explanation = f"Low operational throughput ({total_orders} total orders)."

    return {
        "category": "Operations",
        "score": round(score, 1),
        "status": status,
        "data_status": "sufficient",
        "explanation": explanation
    }


def _evaluate_cash_flow(analytics: Dict[str, Any]) -> Dict[str, Any]:
    fin = analytics.get("financial", {})
    total_rev = fin.get("total_revenue", 0.0)
    total_exp = fin.get("total_expenses", 0.0)
    net_profit = fin.get("net_profit", 0.0)

    if total_rev == 0 and total_exp == 0:
        return {
            "category": "Cash Flow",
            "score": None,
            "status": "insufficient_data",
            "data_status": "insufficient_data",
            "explanation": "No cash inflows or outflows logged."
        }

    if net_profit > 0:
        score = min(95.0, 75.0 + (net_profit / (total_rev or 1.0)) * 50.0)
        status = "healthy" if score < 85 else "excellent"
        explanation = f"Positive net cash flow buffer of ${net_profit:,.2f}."
    elif net_profit == 0:
        score = 60.0
        status = "attention"
        explanation = "Cash flow break-even state."
    else:
        score = max(10.0, 50.0 + (net_profit / (total_exp or 1.0)) * 50.0)
        status = "critical"
        explanation = f"Negative cash flow drain of -${abs(net_profit):,.2f}."

    return {
        "category": "Cash Flow",
        "score": round(score, 1),
        "status": status,
        "data_status": "sufficient",
        "explanation": explanation
    }


def calculate_growth_score(
    analytics: Dict[str, Any],
    custom_weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Calculates deterministic Growth Score (0-100) across 8 business categories.
    Handles data availability cleanly and normalizes category weights dynamically.
    """
    weights = custom_weights or DEFAULT_CATEGORY_WEIGHTS

    # Evaluate each category
    category_evaluators = [
        _evaluate_revenue_growth,
        _evaluate_profitability,
        _evaluate_customer_growth,
        _evaluate_customer_retention,
        _evaluate_marketing,
        _evaluate_inventory,
        _evaluate_operations,
        _evaluate_cash_flow,
    ]

    categories_res: List[Dict[str, Any]] = []
    available_weighted_score = 0.0
    total_weight_used = 0.0
    categories_available = 0
    categories_missing = 0

    for eval_func in category_evaluators:
        cat_result = eval_func(analytics)
        categories_res.append(cat_result)

        cat_name = cat_result["category"]
        cat_score = cat_result["score"]

        if cat_score is not None and cat_result["data_status"] == "sufficient":
            w = weights.get(cat_name, 0.0)
            available_weighted_score += cat_score * w
            total_weight_used += w
            categories_available += 1
        else:
            categories_missing += 1

    # Check overall data status
    if categories_available == 0 or total_weight_used == 0.0:
        return {
            "overall_score": None,
            "data_status": "insufficient_data" if analytics.get("data_status") != "no_data" else "no_data",
            "categories_available": 0,
            "categories_missing": len(category_evaluators),
            "confidence": 0.0,
            "categories": categories_res
        }

    # Weight Normalization: Scale remaining available weights to 1.0 (100%)
    overall_score = round(available_weighted_score / total_weight_used, 1)

    # Confidence calculation: Proportion of total configuration weight available
    confidence = round(total_weight_used, 2)

    data_status = "sufficient_data" if categories_missing <= 3 else "insufficient_data"

    return {
        "overall_score": overall_score,
        "data_status": data_status,
        "categories_available": categories_available,
        "categories_missing": categories_missing,
        "confidence": confidence,
        "categories": categories_res
    }
