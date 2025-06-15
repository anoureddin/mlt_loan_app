# from pathlib import Path

# import pandas as pd
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import LoanRequest
from .serializers import LoanRequestSerializer
from . import utils


# ───────────────────────────────────────────────────────────────
#  CRUD ENDPOINTS
# ───────────────────────────────────────────────────────────────
@api_view(["GET", "POST"])
def loan_requests(request):
    """
    GET → list all saved loan requests (with model decisions)
    POST → create a new request, run prediction, save + return row
    """
    if request.method == "GET":
        qs = LoanRequest.objects.all()
        return Response(LoanRequestSerializer(qs, many=True).data)

    # POST
    ser = LoanRequestSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=400)

    instance = ser.save()
    # prediction (ignore 'prediction' field from client)
    raw_for_model = {k: v for k, v in ser.data.items() if k != "prediction"}
    instance.prediction = utils.predict_one(raw_for_model)
    instance.save()

    return Response(LoanRequestSerializer(instance).data, status=201)


@api_view(["DELETE"])
def loan_request_detail(request, pk: int):
    try:
        obj = LoanRequest.objects.get(pk=pk)
    except LoanRequest.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    obj.delete()
    return Response({"deleted": True}, status=204)


# ───────────────────────────────────────────────────────────────
#  ANALYTICS / MISC
# ───────────────────────────────────────────────────────────────
@api_view(["GET"])
def eda_summary(request):
    """
    Cleaned dataset overview.
    """
    return Response(utils.summarise(utils.get_dataset(cleaned=True)))


@api_view(["GET"])
def eda_raw(request):
    """
    Raw (uncleaned) dataset overview.
    """
    return Response(utils.summarise(utils.get_dataset(cleaned=False)))


@api_view(["GET"])
def data_issues(request):
    """
    Simple data-quality report based on raw CSV.
    """
    return Response(utils.data_issues_report())


@api_view(["GET"])
def model_performance(request):
    """
    Read precision/recall/F1 from the two comparison CSVs.
    """
    return Response(utils.model_metrics())
