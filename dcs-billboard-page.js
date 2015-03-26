/**
 * Parallax Front Page for TouchJet.
 *  
 * Author: Jason Douglas
 */

/**
 * TODO: Handle scaling.
 */

jQuery(document).ready(function()  {
	// Cache the Window object
	$window = jQuery(window);
    var $oldPanel = 0;
    var $oldYPos = 0;

    /** Background Section Processing */
    //The panel sizes 
    var panelSizes = new Array( 738, 364, 600, 600, 600, 531, 614);
	var scaleFactor = 1.0;
    //Calculate the size of the section based on all the panels and set it. 
    var sectionSize = 0, i = 0;
    for(i=0; i < panelSizes.length; i++)
    {   
        sectionSize += Math.round(panelSizes[i]*scaleFactor);
    }

	/**                                          
	 * Set the heights of the panel divs.
	 */
	i = 0;
	jQuery('div.bg-panel').each(function() {
		jQuery(this).height(Math.round(panelSizes[i++]*scaleFactor));
		jQuery(this).width(1200);
	});

	/** Track the "Swap state" of the panels. 2,6 and 7 don't have swap panels.*/
	var swapState = new Array( false, true, false, false, false, true, true );
	
    /** Foreground Section Processing */
    var topLimit = 600; //As measured from top
    var bottomLimit = 3140; //As measured from bottom
	/**
	 * Move the sprite section.
	 */
    var $sprite = jQuery('#dcs-billboard-sprite');
    var curPos = parseInt($sprite.css('top'),10);
	if( isNaN(curPos) || curPos <= 0 ) 
    {
        curPos = topLimit;        
        setTimeout( function() {
            $sprite.animate({ top : curPos },400,"linear");
            swapPanelImages( 1 );
        }, 2000);
    }

    jQuery(window).scroll(function() {
			var yPos = $window.scrollTop();
            var deltaY = yPos - $oldYPos; 
            console.log( "DeltaY: " + deltaY );
            $oldYPos = yPos;
            var winHeight = $window.height();
			var curPos = parseInt($sprite.css('top'),10);
		    var ratio = 2.5;
            var curPanelEdge = getCurrentPanelEdge( curPos );
            var diff = yPos + winHeight - curPanelEdge;

            var moveIt = true;
            isNearPanelEdge( curPos );
            //if( curPos > bottomLimit ) moveIt = false;
            //if( moveIt && isNearPanelEdge(curPos) )
           // {
            //    if( Math.abs(diff) < 200 ) ratio = .5;
           // }
           //`if( Math.abs( yPos + winHeight - curPos ) < 300 ) ratio = 0.5;

            if( moveIt )
			{
			    curPos += deltaY*getSpriteVelocity(curPos);
			    console.log( "sprite curPos: " + curPos );
				//$sprite.animate( { 'top' : "+="+(deltaY*getSpriteVelocity(curPos))+"px" } );              
			}
		}); 

	/**
	 * Get the panel number based on curPos.
	 */
	function getPanelNumber(curPos)
	{
		var i = 1;
		var total = panelSizes[0]*scaleFactor;
		for(i=1; i<panelSizes.length; i++, total += panelSizes[i]*scaleFactor)
		{
			if( curPos < total )
			{
				return i;
			}
		}
	}

    /**
     * Return true if close to (swappable) panel edge.
     * Price is Right rules apply.
     */
    function isNearPanelEdge(curPos)
    {
        var retval = false;
        var panelNum = getPanelNumber(curPos);
        var delta = getCurrentPanelEdge(curPos) - curPos;
        //console.log( "curPanelEdge: " + curPanelEdge );
        if( (delta < 105) && (delta >= 0) )
        {   
            //We only care if we're in a swappable panel.
            if( !swapState[panelNum-1] ) 
            {
                //console.log( "SLOWER DOWN!" );
                retval = true;
                if( delta < 80 ) swapPanelImages(panelNum);
            }
        }
        return retval;
    }

    /**
     * Get the current panel edge.
     */
    function getCurrentPanelEdge(curPos)
    {
        var i = 0, curPanelEdge = 0;
        var panelNum = getPanelNumber(curPos);
        for(i=0; i<panelNum; i++)
        {
            curPanelEdge += panelSizes[i]*scaleFactor;
        }
        return curPanelEdge;
    }

    /**
     * Swap images
     */
    function swapPanelImages(panelNum)
    {
		if( !swapState[panelNum-1] )
		{
            console.log( "Swapping Panel: " + panelNum );
            jQuery('img#bg-panel-'+panelNum).toggleClass("transparent");
			//swapState[panelNum-1] = true;
		}
    }

    /**
     * Calculate the sprite velocity based on position.
     */
    function getSpriteVelocity(curPos)
    {
        var retval = 0;
        var panelNum = getPanelNumber(curPos);
        var prevEdge=0, nextEdge=0, i=0;
        
        if( curPos > bottomLimit ) return 0;
        
        for(i=0; i<panelNum-2; i++)
        {
            prevEdge += panelSizes[i]*scaleFactor;  
        }
        nextEdge = prevEdge + (panelSizes[panelNum-1]*scaleFactor);
        //console.log( "prevEdge: " + prevEdge + " nextEdge: " + nextEdge + " scrollTop: " + $window.scrollTop() );
        if( (curPos > (prevEdge+100) && curPos < (nextEdge-100)) ||
            ((curPos - $window.scrollTop()) < 100) )
        {
            retval = 15;
        }
        console.log( "velocity: " + retval );
        return retval;
    }
}); 

/** 
 * Create HTML5 elements for IE's sake
 */
document.createElement("article");
document.createElement("section");
