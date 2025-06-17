from django.contrib import admin
from .models import LoanRequest


@admin.register(LoanRequest)
class LoanRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "gender",
        "education",
        "applicant_income",
        "loan_amount",
        "prediction",
    )
    search_fields = ("id",)
