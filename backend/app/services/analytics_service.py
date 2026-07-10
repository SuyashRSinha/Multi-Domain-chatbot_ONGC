from app.repositories.analytics_repository import AnalyticsRepository


class AnalyticsService:

    def __init__(self):

        self.repository = AnalyticsRepository()

    def get_dashboard_cards(
        self,
        email
    ):

        return {

            "total_conversations":
                self.repository.get_total_conversations(
                    email
                ),

            "total_messages":
                self.repository.get_total_messages(
                    email
                ),

            "total_queries":
                self.repository.get_total_queries(
                    email
                ),

            "total_documents":
                self.repository.get_total_documents(
                    email
                )
        }

    def get_domain_usage(
        self,
        email
    ):

        return self.repository.get_domain_usage(
            email
        )