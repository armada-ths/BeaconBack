
__author__ = 'lundh'
import base64

#import pymysql
import MySQLdb
import re
import pickle
import logging


#####################################################
#           Define DB Settings
#####################################################
DB_URL = "server.oskarlundh.eu" #local ip 192.168.1.5
DB_NAME = 'armada_fair_test'
DB_USER = "root"
DB_PASSWORD = "password"

logging.basicConfig(filename='database.log', level=logging.ERROR)
#####################################################
class DataBase:
    #####################################################
    #           Init
    #####################################################
    def __init__(self):
        self.con = MySQLdb.connect(DB_URL,DB_USER, DB_PASSWORD, DB_NAME, charset='utf8')
        with self.con:
            self.cursor = self.con.cursor()

            self.cursor.execute("SELECT VERSION()")
            result = self.cursor.fetchone()

            if result:
                print("Connected!")
                self.cursor.execute('SHOW TABLES')
                result = self.cursor.fetchall()
                #print(result)
            self.con.autocommit(True)

    #####################################################
    #           End connection to database
    #####################################################
    def end_connection(self):
        self.db.close()

    #####################################################
    #           Get Unprocessed Content
    #####################################################
    def get_reports(self):
        #self.cursor.execute(b'SELECT * FROM report ORDER BY timestamp ASC')
        #content = [r for r in dict_gen(self.cursor.execute('SELECT * FROM report ORDER BY timestamp ASC'))]
        #content = self.cursor.fetchall()
        dictCursor = self.con.cursor(MySQLdb.cursors.DictCursor)
        dictCursor.execute("SELECT timestamp, id, type_id, user, AsText(location) AS location, map FROM report ORDER BY timestamp ASC")
        #self.cursor.execute("SELECT timestamp, id, type_id, user, location, map FROM report ORDER BY timestamp ASC")
        content = dictCursor.fetchall()

        #print(content)
        for x in content:
            x['location'] = x['location'].replace("POINT(", "").replace(")", "").split(" ")
            dictCursor.execute('SELECT name FROM beacon WHERE id IN (SELECT beacon FROM hit WHERE report='+str(x['id'])+')')
            x['beacons'] = dictCursor.fetchall()

            dictCursor.execute('SELECT * FROM map WHERE id='+str(x['map']))
            x['map'] = dictCursor.fetchall()

            dictCursor.execute('SELECT * FROM user WHERE user_id='+str(x['user']))
            x['user'] = dictCursor.fetchall()

        return content

