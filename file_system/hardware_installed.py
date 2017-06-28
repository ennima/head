
from subprocess import Popen, PIPE
import os
import time

start = time.time()

sudo_password = 'adminGV!'
command = "lshw -xml".split()
print(command)
p = Popen(['sudo', '-S'] + command, stdin=PIPE, stderr=PIPE, stdout=PIPE,
          universal_newlines=False)
sudo_prompt = p.communicate(sudo_password + '\n')[0]

#print(sudo_prompt)
f_xml = open("hardware.xml","w")
f_xml.write(sudo_prompt)

print("It took "+str(time.time()-start)+" seconds")


