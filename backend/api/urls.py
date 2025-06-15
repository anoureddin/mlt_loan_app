from django.urls import path
from . import views

urlpatterns = [
    # CRUD
    path("requests/", views.loan_requests, name="loan_requests"),
    path("requests/<int:pk>/", views.loan_request_detail, name="loan_request_detail"),
    # analytics / misc
    path("eda/", views.eda_summary, name="eda_summary"),
    path("eda/raw/", views.eda_raw, name="eda_raw"),
    path("metrics/", views.model_performance, name="model_performance"),
    path("report/", views.data_issues, name="data_issues"),
]
