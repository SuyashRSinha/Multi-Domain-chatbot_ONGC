from app.repositories.admin_repository import AdminRepository


class AdminService:

    def __init__(self):

        self.repository = AdminRepository()

    def get_dashboard_data(self):

        return {

            "total_conversations":
                self.repository.get_total_conversations(),

            "total_messages":
                self.repository.get_total_messages(),

            "total_documents":
                self.repository.get_total_documents(),

            "documents_per_domain":
                self.repository.get_documents_per_domain(),

            "recent_conversations":
                self.repository.get_recent_conversations()

        }