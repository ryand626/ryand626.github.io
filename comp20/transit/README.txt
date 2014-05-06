Implemented:

-The program finds the user's location, and places a marker on a map at their 
 location.  If the person does not have geolocation, a default location is
 loaded in near Boston
-The program draws either the red, orange, or blue line.  If there is an error
 parsing the JSON, the program gives an error page
-The program displays custom station icons on the map
-Upon clicking a station icon, the program displays and information window that
 gives the name of the station, how far away it is, what line it is from, the 
 subway arrival schedule, and the destination direction.  This action also causes
 all other information windows to close
-A CSS file was used for styling purposes

-For fun, I decided to mess around with the directions API as well.  I used the
 directions API to draw a line from the person to the closest station.  Also, 
 if the user clicked on a different station, the line would update and show them
 how to walk to that station.  I'm still debating whether or not I should put a
 button in the information window that let the user receive walking directions to 
 the station they clicked on.

Collaborators:
none

Hours Spent:
16ish on and off with many distractions

