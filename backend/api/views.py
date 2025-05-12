import pandas as pd
import joblib
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import LoanRequest
from .serializers import LoanRequestSerializer

# Load model
model = joblib.load("api/ml_model.pkl")


@api_view(['GET'])
def list_requests(request):
    data = LoanRequest.objects.all()
    return Response(LoanRequestSerializer(data, many=True).data)


@api_view(['POST'])
def add_request(request):
    serializer = LoanRequestSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        df = pd.DataFrame([serializer.data])
        df.drop(columns=['prediction'], inplace=True)
        instance.prediction = model.predict(df)[0]
        instance.save()
        return Response(LoanRequestSerializer(instance).data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_request(request, pk):
    try:
        loan = LoanRequest.objects.get(id=pk)
        loan.delete()
        return Response({'deleted': True})
    except LoanRequest.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
