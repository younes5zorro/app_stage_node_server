
from pymongo import MongoClient
from pymongo import InsertOne
import datetime

Client = MongoClient("mongodb://admin:bigdata5@ds247171.mlab.com:47171/qstapp" , connectTimeoutMS = 30000)
server = MongoClient("mongodb://admin:roboadvisor07@ds237192.mlab.com:37192/robo_advisor" , connectTimeoutMS = 30000)
client_db = Client.get_database('qstapp')
server_db = server.get_database('robo_advisor')
crows = client_db.tweets
srows = server_db.tweets
#
# result = crows.find({})
# print(result)



cursor_excess_new = (
    crows.find()
      .sort([("_id", 1)])
)

queries = [InsertOne(doc) for doc in cursor_excess_new]
srows.bulk_write(queries)
# post = {"author": "Mike",
#         "text": "My first blog post!",
#         "tags": ["mongodb", "python", "pymongo"],
#         "date": datetime.datetime.utcnow()}
# #
# # post_id = srows.insert_one(post).inserted_id
# print(srows.find_one())