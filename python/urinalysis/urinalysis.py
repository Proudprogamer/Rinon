import os
import pandas as pd
import joblib

def analyse(data):
    #model = joblib.load('./training/kidneystone.pkl')
    #scaler = joblib.load('./training/kidneystonescaler.pkl')

    model = joblib.load('/home/maniakss/mysite/training/kidneystone.pkl')
    scaler = joblib.load('/home/maniakss/mysite/training/kidneystonescaler.pkl')
    
    column_names = ['gravity', 'ph', 'osmo', 'cond', 'urea', 'calc']
    df = pd.DataFrame(data, columns=column_names)

    scaled_df = scaler.transform(df)
    predictions = model.predict(scaled_df)

    for i, p in enumerate(predictions):
        return "RISK" if p == 1 else "NO RISK"
