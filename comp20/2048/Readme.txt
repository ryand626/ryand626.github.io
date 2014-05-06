TUFTS COMP 20 ASSIGNMENT 4: 2048-gamecenter

LAST MODIFIED: 4/12/2014

SPECIFICATIONS: http://tuftsdev.github.io/WebProgramming/assignments/a4.html

BY: Ryan Dougherty 

DESCRIPTION: Modifying 2048 to save high scores server side
             using Node JS, MongoDB and Heroku
             POST /submit.json works according to spec
             GET /scores.json works according to spec
             / (the index) works according to spec

TIME SPENT: 12 hours

COLLABORATORS: Raewyn Duvall - helped with moral support and mongodb basics



MODIFICATIONS TO 2048 FILES:
-------------------------------------------------------------------------------
app.js
-------------------------------------------------------------------------------
Added this to communicate with the heroku server using mongodb and node js

-------------------------------------------------------------------------------
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js">
</script>
-------------------------------------------------------------------------------
Added to the index.html file so that $.post could be used


-------------------------------------------------------------------------------
$.post("http://nameless-harbor-2839.herokuapp.com/submit.json", {"username" : "
Ryan", "score" : metadata.score, "grid" : JSON.stringify(grid.serialize()), "cr
eated_at" : new Date()});
-------------------------------------------------------------------------------
Added into html_actuator.js in HTMLActuator.prototype.actuate in the if 
statement checking if metadata.terminated was true

In this way if metadata.terminated is true, meaning there was a win or a loss,
the score would be posted using my name as the username


EXPLAINATION OF SCORE AND GRID:
The SCORE (among other things) is stored in the metadata of some of the 
arguments of the the html_actuator.js file put there by the game_manager.js 
file when GameManager.prototype.actuate is used

The GRID originates from grid.js.  The constructor is called by game_manager.js
and is passed to the functions of other files (like html_actuator.js) that use
the grid in various ways

EXTRA BITS: I added styling
