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
    var $deltaY = 0;
    
    /** Background Section Processing */
    //The panel sizes 
    var panelSizes = new Array( 1475, 728, 1200, 1200, 1200, 753, 1291);
	var scaleFactor = 0.5;
	var panelWidth = 2400; //Starting image widths
	var displayWidth = panelWidth * scaleFactor;
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
		jQuery(this).height(panelSizes[i++]*scaleFactor);
		jQuery(this).width(displayWidth);
	});

	/**Always scroll to the top on load */
    //$window.scrollToTop();

	/** Track the "Swap state" of the panels. 2,6 and 7 don't have swap panels.*/
	var swapState = new Array( false, true, false, false, false, true, true );
	
    /** Foreground Section Processing */
    var topLimit = 1200*scaleFactor; //As measured from top
    var bottomLimit = (5803+300)*scaleFactor; //As measured from bottom
	/**
	 * Move the sprite section.
	 */
    var $sprite = jQuery('#dcs-billboard-sprite');
    var curPos = parseInt($sprite.css('top'),10);
	if( isNaN(curPos) || curPos <= 0 ) 
    {
        curPos = topLimit;        
        setTimeout( function() {
            $sprite.animate({ top : curPos },1000,"linear");
            swapPanelImages( 1 );
        }, 1000);
    }

    jQuery(window).scroll(function() {
		var yPos = $window.scrollTop();
        $deltaY = yPos - $oldYPos; 
        $oldYPos = yPos;
        var winHeight = $window.height();
		var curPos = parseInt($sprite.css('top'),10);
		var panelNum = getPanelNumber( curPos );
		jQuery('#dcs-billboard-sprite-text').val( "panel num: " + panelNum + " " + curPos );
	    var ratio = 2.5;
        var curPanelEdge = getCurrentPanelEdge( curPos );
        var diff = yPos + winHeight - curPanelEdge;

		//Determine if to move
        var moveIt = true;
        if( curPos > bottomLimit && ($deltaY > 0) ) {
             moveIt = false; 
            //console.log( "Past bottom limit going down." );
        }
        if( curPos < topLimit && ($deltaY < 0) )  {
            moveIt = false;
        }
        if( curPos > (yPos + winHeight - 250) && ($deltaY > 0) ) {
            moveIt = false;
            //console.log( "lower window zone" );
        }
        if( curPos < (yPos + topLimit) && ($deltaY < 0) )  {
            moveIt = false;        
            //console.log( "Upper window limit" );
        }
        //Triggers panel swapping
        isNearPanelEdge( curPos );
		//Move the sprite
        if( moveIt )
		{
            var velocity = 1.3;
            var delta = $deltaY*velocity;
            //if( delta > 3 ) delta = 3;
            $sprite.css( { 'top' : curPos+delta } );
	    }
    }); 
    
    /**
    * Get the Panel number based on curPos.
    */
    function getPanelNumber(curPos)
    {
    	var i = 0, farEdge = 0, nearEdge = 0, tmpVal = 0;
    	for(i=0; i<panelSizes.length; i++)
    	{
    		nearEdge = farEdge;
    		//console.log( "panel " + (i+1) + " size: " + (panelSizes[i]*scaleFactor) );
    		farEdge = nearEdge + (panelSizes[i]*scaleFactor);
    		//console.log( "panel " + (i+1) + " top edge " + nearEdge + " bottom Edge: " + farEdge );
    		if( curPos > nearEdge && curPos < farEdge )
    		{
    			return (i+1);
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
		var panelSize = panelSizes[panelNum-1]*scaleFactor;
		
		//If the panel numbers change, swap the old one back.
		if( panelNum != $oldPanel ) 
                jQuery('img#bg-panel-'+ $oldPanel).removeClass("transparent");
                
        if( $deltaY > 0 )
        {   
        	//Going down
	        var delta = getCurrentPanelEdge(curPos) - curPos;
            //We only care if we're in a swappable panel.
            if( !swapState[panelNum-1] ) 
            {
                //console.log( "SLOWER DOWN!" );
                retval = true;
                if( delta < (panelSize/2) ) swapPanelImages(panelNum);
            }
        }
        else
        {
        	//Going up.
        	var delta = curPos - getCurrentPanelEdge(curPos);
        	if( delta < (panelSize*.95) ) swapPanelImages(panelNum);
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
        if( $deltaY < 0 ) panelNum--; //If we're going up, we want the panel edge on the top.
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
		if( !swapState[panelNum-1] && ($oldPanel != panelNum) )
		{
            console.log( "Swapping Panel: " + panelNum );
            jQuery('img#bg-panel-'+panelNum).toggleClass("transparent");
            $oldPanel = panelNum;
		}
    }
}); 

/** 
 * Create HTML5 elements for IE's sake
 */
document.createElement("article");
document.createElement("section");
