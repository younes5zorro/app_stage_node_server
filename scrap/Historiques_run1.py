from pymongo import MongoClient
from selenium import webdriver
from fancyimpute import MICE
from fancyimpute import KNN
import fancyimpute
from sklearn.preprocessing import Imputer
from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time
import os
from selenium.webdriver.support.select import Select
import json
import datetime
from pandas import DataFrame
import numpy as np
import pandas as pd
import csv

Client = MongoClient("mongodb://admin:bigdata5@ds247171.mlab.com:47171/qstapp" , connectTimeoutMS = 30000)
db = Client.get_database('qstapp')
rows = db.rows

T=[]
bourses_dict = {}
driverLocation = "chromedriver.exe"
os.environ["webdriver.chrome.driver"] = driverLocation
driver = webdriver.Chrome(driverLocation)
url = "http://www.casablanca-bourse.com/bourseweb/Negociation-Historique.aspx?Cat=24&IdLink=302"
driver.maximize_window()
driver.get(url)
element = driver.find_element_by_xpath("//select[@id='HistoriqueNegociation1_HistValeur1_DDValeur']")  # find the element : choisisser une valeur
all_options = element.find_elements_by_tag_name("option")

#all_options = element.text
for i, option in enumerate(all_options):
    if i!=0:
        T.append(option.text)

class Transactions():

    def test(self , x):
        driverLocation = "chromedriver.exe"
        os.environ["webdriver.chrome.driver"] = driverLocation
        driver = webdriver.Chrome(driverLocation)
        url = "http://www.casablanca-bourse.com/bourseweb/Negociation-Historique.aspx?Cat=24&IdLink=302"
        driver.maximize_window()
        driver.get(url)#open the url

        element = driver.find_element_by_xpath("//select[@id='HistoriqueNegociation1_HistValeur1_DDValeur']")  # find the element : choisisser une valeur
        sel = Select(element) # Selectionner l'element`'''
        driver.implicitly_wait(30)

        elm = element.send_keys(x)
        driver.implicitly_wait(10)
        duree = element.find_element(By.XPATH, "//select[@id='HistoriqueNegociation1_HistValeur1_DDuree']")
        duree = Select(duree)
        duree.select_by_visible_text("3 ans")
        valider = element.find_element(By.XPATH,"//input[@id='HistoriqueNegociation1_HistValeur1_Image1']")
        valider.click()
        element1 = driver.find_element(By.XPATH , "//div[@id='HistoriqueNegociation1_HistValeur1_PnlResultat']//tbody")
        all_rows = element1.find_elements_by_tag_name("tr")

        bourse_dict = []

        for j, row in enumerate(all_rows):

            if j >= 3:
                column = row.find_elements_by_tag_name("td")
                co = []
                for col in column:
                    co.append(col.text)
                d = datetime.datetime.strptime(co[1], "%d/%m/%Y")

                ttem = {"slug": (co[3].lower()).replace(" ", ""),"seance": d, "designation": co[3], "premierCours": float(((co[5].replace(" ", "")).replace(",", ".")).replace("-", str(np.nan))),"dernierCours": float(((co[7].replace(" ", "")).replace(",", ".")).replace("-", str(np.nan))),"Hjours":float(((co[9].replace(" ", "")).replace(",", ".")).replace("-", str(np.nan))),"Bjours":float(((co[11].replace(" ", "")).replace(",", ".")).replace("-", str(np.nan))),"titres": float(((co[13].replace(" ", "")).replace(",", ".")).replace("-", str(np.nan))),"cap": float(((co[15].replace(" ", "")).replace(",", ".")).replace("-", str(np.nan)))}
                bourse_dict.append(ttem)
                if not (rows.update(ttem, ttem,  upsert = True)['updatedExisting']):
                    print("insert || ",ttem['seance'], ' => ', ttem['designation'])
                else:
                    print("update || ",ttem['seance'], ' => ', ttem['designation'])
            # else :
            #      continue


        time.sleep(10)
        driver.quit()


        return bourse_dict

# pass=["DOUJA PROM ADDOHA","ALLIANCES","AFRIC INDUSTRIES SA","AFMA","AGMA","ALUMINIUM DU MAROC","AUTO HALL","ATLANTA","ATTIJARIWAFA BANK","BALIMA","BMCE BANK","BMCI","BCP","CENTRALE DANONE","CDM","CIH","CIMENTS DU MAROC", "MINIERE TOUISSIT","COLORADO","CARTIER SAADA","CARTIER SAAD","COSUMAR","CTM","DELTA HOLDING","DIAC SALAF","DELATTRE LEVIVIER MAROC","DARI COUSPATE","DISWAY","EQDOM","FENIE BROSSETTE","AFRIQUIA GAZ","HPS","ITISSALAT AL-MAGHRIB","IB MAROC.COM", "MMORENTE INVEST","INVOLYS","JET CONTRACTORS","LABEL VIE","LESIEUR CRISTAL","LAFARGEHOLCIM MAR	","LYDEC","M2M Group","MAGHREBAIL","MED PAPER","MICRODATA","MAROC LEASING", "MANAGEM","MAGHREB OXYGENE","SODEP-Marsa Maroc","AUTO NEJMA	","NEXANS MAROC","ENNAKL","OULMES","PROMOPHARM S.A.","RES DAR SAADA","REBAB COMPANY","RISMA","S.M MONETIQUE","SAHAM ASSURANCE","SAMIR","BRASSERIES DU MAROC","SONASID","SALAFIN","SMI","STOKVIS NORD AFRIQUE","SNEP","SOTHEMA", "REALISATIONS MECANIQUES", "STROC INDUSTRIE", "TIMAR", "TOTAL MAROC", "TAQA MOROCCO","TASLIF", "UNIMER", "WAFA ASSURANCE","ZELLIDJA S.A"]
passer = ['DOUJA PROM ADDOHA','ALLIANCES','AFRIC INDUSTRIES SA','AFMA','AGMA'];
for tt in T:
    if(tt not in passer):
        chromeTest = Transactions()
        file = chromeTest.test(tt)
        bourses_dict[tt]=file

print(bourses_dict)