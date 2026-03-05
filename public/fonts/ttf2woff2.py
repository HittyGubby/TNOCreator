from fontTools.ttLib import TTFont
import os
for file in os.listdir('.'):
    if file.endswith(".ttf"):
        font = TTFont(file)
        font.flavor = 'woff2'
        font.save(file.replace(".ttf", ".woff2"))