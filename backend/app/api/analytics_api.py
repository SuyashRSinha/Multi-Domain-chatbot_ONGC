from fastapi import APIRouter

from app.services.analytics_service import AnalyticsService

router = APIRouter()

analytics_service = AnalyticsService()


@router.get("/dashboard")
def get_dashboard(
    email: str
):

    return analytics_service.get_dashboard_cards(
        email
    )


@router.get("/domain-usage")
def get_domain_usage(
    email: str
):

    return analytics_service.get_domain_usage(
        email
    )