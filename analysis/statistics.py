
__author__ = 'lundh'
import user_stories
import db_controller as db
database_controller = db.DataBase()


def beacon_stats(reports):
    beacons = dict()
    for report in reports:
        if report['beacons'][0]['name'] in beacons.keys():
            beacons[report['beacons'][0]['name']].append(report)
        else:
            beacons[report['beacons'][0]['name']] = [report]

    for beaconK in beacons.keys():
        print("{0} had {1} traffic".format(beaconK, len(beacons[beaconK])))


def user_stats(reports):
    users = dict()
    for report in reports:
        #print(report)
        #print report['user'][0]['user_id']
        if report['user'][0]['user_id'] in users.keys():
            users[report['user'][0]['user_id']].append(report)
        else:
            users[report['user'][0]['user_id']] = [report]

    print("There were {0} vistors at the fair".format(len(list(users.keys()))))


def user_paths(reports):
    maps = dict()
    for report in reports:
        #print(report)
        #print report['user'][0]['user_id']
        if report['map'][0]['id'] in maps.keys():
            maps[report['map'][0]['id']].append(report)
        else:
            maps[report['map'][0]['id']] = [report]
    for map in maps.keys():
        user_stories.show_path(maps[map])


if __name__ == "__main__":
    reports = database_controller.get_reports()
    user_stats(reports)
    beacon_stats(reports)
    user_paths(reports)