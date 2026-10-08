from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class TopProductItem(BaseModel):
    product_id: Optional[str] = None
    name: str
    units_sold: float
    revenue: float


class PeriodSalesItem(BaseModel):
    period: str
    orders_count: int
    revenue: float


class FinancialMetrics(BaseModel):
    total_revenue: float
    total_expenses: float
    net_profit: float
    profit_margin: Optional[float] = None
    revenue_growth: Optional[float] = None
    expense_growth: Optional[float] = None
    average_order_value: float


class CustomerMetrics(BaseModel):
    total_customers: int
    new_customers: int
    repeat_customers: int
    repeat_customer_rate: float
    customer_revenue: float


class SalesMetrics(BaseModel):
    total_orders: int
    total_units_sold: float
    average_order_value: float
    top_products: List[TopProductItem] = Field(default_factory=list)
    sales_by_period: List[PeriodSalesItem] = Field(default_factory=list)


class InventoryMetrics(BaseModel):
    total_products: int
    total_stock: float
    low_stock_products: int
    out_of_stock_products: int
    inventory_value: float


class MarketingMetrics(BaseModel):
    marketing_spend: float
    leads: int
    conversions: int
    conversion_rate: float
    marketing_revenue: float
    roas: float


class BusinessAnalytics(BaseModel):
    business_id: str
    generated_at: str
    data_status: str  # "sufficient_data", "insufficient_data", "no_data"
    financial: FinancialMetrics
    customers: CustomerMetrics
    sales: SalesMetrics
    inventory: InventoryMetrics
    marketing: MarketingMetrics
