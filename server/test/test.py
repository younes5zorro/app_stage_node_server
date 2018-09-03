import sys
nb = float(sys.argv[1])
import json
data = {
    "carre": nb*nb,
    "cube": nb*nb*nb
}

# json.dumps(data) 
print(json.dumps(data) )
sys.stdout.flush()