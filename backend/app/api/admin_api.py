from fastapi import APIRouter

from app.services.admin_service import AdminService
from app.schemas.admin_schema import DashboardResponse

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

service = AdminService()


@router.get(
    "/dashboard",
    response_model=DashboardResponse
)
def dashboard():

    return service.get_dashboard_data()