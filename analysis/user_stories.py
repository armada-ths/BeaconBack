
__author__ = 'lundh'
import db_controller as db
from PIL import Image
from PIL import ImageDraw
import random
import heatmap

def random_color():
    return random.randint(0,255), random.randint(0,255), random.randint(0,255), random.randint(0,255)


def show_path(reports):
    #print reports
    mapname = reports[0]['map'][0]['map_name']
    map_width = int(reports[0]['map'][0]['width'])
    map_height = int(reports[0]['map'][0]['height'])

    im = Image.open("maps/"+mapname)
    draw = ImageDraw.Draw(im)

    color = random_color()

    for i in range(len(reports)-1):
        if i == 0:
            draw.ellipse((float(reports[i]['location'][0])-5, float(reports[i]['location'][1])-5,
                          float(reports[i]['location'][0])+5, float(reports[i]['location'][1])+5), fill = 'green', outline ='green')
        elif i == len(reports)-2:
            draw.ellipse((float(reports[i]['location'][0])-5, float(reports[i]['location'][1])-5,
                          float(reports[i]['location'][0])+5, float(reports[i]['location'][1])+5), fill = 'red', outline ='red')
        else:
            draw.ellipse((float(reports[i]['location'][0])-2, float(reports[i]['location'][1])-2,
                          float(reports[i]['location'][0])+2, float(reports[i]['location'][1])+2), fill = 'blue', outline ='blue')
        #print reports[i]['location'], float(reports[i]['location'][0])
        draw.line((float(reports[i]['location'][0]), float(reports[i]['location'][1]),
                   float(reports[i+1]['location'][0]),float(reports[i+1]['location'][1])), fill=color, width=2)

    #seen = set()
    #seen_add = seen.add
    pts = [(float(x['location'][0]), float(x['location'][1])) for x in reports]
    #pts = [(random.random(), random.random()) for x in range(100)]
    print len(pts), pts
    print map_width, map_height

    hm = heatmap.Heatmap()
    heatmap_name = "heatmaps/"+mapname
    hm.heatmap(pts, size=(map_width, map_height)).save(heatmap_name)
    heatmap_im = Image.open(heatmap_name)

    im.paste(heatmap_im, (0, 0), heatmap_im)

    #overlay = hm.convert("RGBA")

    #new_img = Image.blend(im, hm, 0.5)
    #new_img.save("new.png","PNG")
    im.save("result/"+"R"+mapname, "PNG")
    im.show()

if __name__ == '__main__':
    pass