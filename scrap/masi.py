
import os
import csv
from pymongo import MongoClient
import datetime

Client = MongoClient("mongodb://admin:bigdata5@ds247171.mlab.com:47171/qstapp" , connectTimeoutMS = 30000)
db = Client.get_database('qstapp')
masi = db.masi

with open('masi.csv', encoding="utf8") as f:
    reader = csv.reader(f,delimiter=';')
    for row in reader:
        print(row)
        item = {'seance': datetime.datetime.strptime(row[0], "%d/%m/%Y"), 'valeur': float((row[1].replace(" " , "")).replace(",", ".")), 'variation': float((row[2].replace(" " , "")).replace(",", "."))}
        masi.update(item, item,  upsert= True)