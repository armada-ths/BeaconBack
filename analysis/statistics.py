
__author__ = 'lundh'
import user_stories
import db_controller as db
database_controller = db.DataBase()


def beacon_stats(reports):
    beacons = dict()
    sum = 0
    for report in reports:
        if report['beacons'][0]['name'] in beacons.keys():
            beacons[report['beacons'][0]['name']].append(report)
        else:
            beacons[report['beacons'][0]['name']] = [report]

    for beaconK in beacons.keys():
        sum += len(beacons[beaconK])
        print("{0} had {1} traffic".format(beaconK, len(beacons[beaconK])))
    print("Total traffic during fair: {0}".format(sum))


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


def users_on_map(map, reports):
    users = dict()
    for report in reports:
        #print(report)
        #print report['user'][0]['user_id']
        if report['map'][0]['map_name'] == map:
            if report['user'][0]['user_id'] in users.keys():
                users[report['user'][0]['user_id']].append(report)
            else:
                users[report['user'][0]['user_id']] = [report]
    return users


def user_paths(reports):
    maps = dict()
    for report in reports:
        #print(report)
        #print report['user'][0]['user_id']
        if report['map'][0]['id'] in maps.keys():

            pass
        else:
            key = report['map'][0]['id']
            maps[key] = dict()
            maps[key]["map_name"] = report['map'][0]['map_name']
            maps[key]['height'] =report['map'][0]['height']
            maps[key]['width'] =report['map'][0]['width']

    for map in maps.keys():
        user_stories.show_path(maps[map], users_on_map(maps[map]['map_name'], reports))


if __name__ == "__main__":
    reports = database_controller.get_reports()
    user_stats(reports)
    beacon_stats(reports)
    user_paths(reports)