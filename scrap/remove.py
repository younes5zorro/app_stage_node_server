
import os
import csv
from pymongo import MongoClient
import datetime

Client = MongoClient("mongodb://admin:bigdata5@ds247171.mlab.com:47171/qstapp" , connectTimeoutMS = 30000)
db = Client.get_database('qstapp')
rows = db.rows

item = {
    "slug": 'alliances'
}
print(rows.remove(item))