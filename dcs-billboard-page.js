/**
 * Billboard + Sprite Front Page for TouchJet.
 *  
 * Author: Jason Douglas
 */

jQuery(document).ready(function()  {
	// Cache the Window object
	$window = jQuery(window);
    var $oldPanel = 0, $oldYPos = 0, $deltaY = 0;
    var topLimit, bottomLimit;
    var spritePos = -200;
    
    /** Background Section Processing */
    //The panel sizes 
    var panelSizes = new Array( 1475, 620, 1200, 1200, 1200, 753, 1291);
	var scaleFactor = 0.5;
	var panelWidth = 2400; //Starting image widths

	/** Dictates the "Swap state" of the panels. 2,6 and 7 don't have swap panels.*/
	var swapState = new Array( true, false, true, true, true, false, false );
	//Adjust the scale factor based on the window width.
    processScaleFactorChange( $window.width() );
    
	/**
	 * Initial Sprite Positioning. 
	 */
    var $sprite = jQuery('#dcs-billboard-sprite');
    //var curPos = parseInt($sprite.css('top'),10);
    spritePos = massageSpritePosition( spritePos );
    /** Move the sprite */
    setTimeout( function() {
		moveSprite( spritePos );
        swapPanelImages( 1 );
    }, 1000);

	/**
	 * Handle resize events. We need to recalculate the scaleFactor
	 */
	jQuery(window).resize( function() {
		processScaleFactorChange( jQuery("section.bg-panel").width() );
		
		/**Refresh sprite as necessary */
	    spritePos = parseInt($sprite.css('top'),10);
    	spritePos = massageSpritePosition( spritePos );
    	/** Move the sprite */
    	setTimeout( function() {
    		moveSprite( spritePos );
    		swapPanelImages( 1 );
    	}, 1000);
		/** Handle any swapping */
		isNearPanelEdge( spritePos );
		tweakPanelTwo( spritePos );
	});

	/** 
	* React to scrolling events 
	*/
    jQuery(window).scroll(function()  {
    	//Scroll Direction and delta
		var yPos = $window.scrollTop();
        $deltaY = yPos - $oldYPos; 
        $oldYPos = yPos; 
        //console.log( "DeltaY : " + $deltaY );

		spritePos = massageSpritePosition(spritePos + $deltaY);
        //Triggers panel swapping
        var isNearEdge = isNearPanelEdge( spritePos );
        tweakPanelTwo( spritePos );
	
		jQuery('#dcs-billboard-sprite').css( { "transition" : "top .5s ease-in-out" } );
		jQuery('#dcs-billboard-sprite-text').val( "panel num: " + getPanelNumber(spritePos) + " " + spritePos );
        moveSprite( spritePos );
	}); 
    
    /**
    * Calculate panels sizes based on scalefactor
    */
    function processScaleFactorChange(newWidth)
    {
    	scaleFactor = newWidth/2400;
    	
    	//This is our only flexible panel so we need to keep it sized correctly.
    	jQuery('div#bg-panel-2').height( panelSizes[1]*scaleFactor ); 
    	
    	//Scale the sprite height
    	jQuery('#dcs-billboard-sprite').height( newWidth/10 );
    	
    	/** Foreground Section Processing */
    	topLimit = 1200*scaleFactor; //As measured from top
    	if( topLimit > ($window.height() * 0.85) )
    		topLimit = ($window.height() * 0.85);
    	bottomLimit = (6180)*scaleFactor; //As measured from bottom
    }
    
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
    		//JGD Same for now.
    		if( $deltaY > 0 )
    		{
    			if( curPos > nearEdge && curPos < farEdge )
    			{
    				return (i+1);
    			}
    		}
    		else
    		{
    			if( curPos > nearEdge && curPos < farEdge )
    			{
    				return (i+1);
    			}
    		}
        }
    }

    /**
     * Return true if close to (swappable) panel edge.
     * Price is Right rules apply.
     * JGD: THis is really becoming: SHould sprite speed up or slow down?
     */
    function isNearPanelEdge(curPos)
    {
        var retval = false;
        var panelNum = getPanelNumber(curPos);
		var panelSize = panelSizes[panelNum-1]*scaleFactor;
		var swapRange = 0.75; //As measured from bottom
		var speedRange = 0.85; //As measured in the middle. we go fast when this returns false.
		var speedDelta = (panelSize*speedRange)/2; 
		
		//If the panel numbers change, swap the old one back.
		if( panelNum != $oldPanel ) 
            jQuery('img#bg-panel-'+ $oldPanel).removeClass("transparent");
                
        if( $deltaY > 0 )
        {   
        	//Going down
        	var bottomEdge = getCurrentPanelEdge(curPos);
        	var topEdge = bottomEdge - panelSize;
	        var delta = getCurrentPanelEdge(curPos) - curPos;
            //We only care if we're in a swappable panel.
            if( swapState[panelNum-1] ) 
            {
                if( delta < (panelSize*swapRange) ) 
                {
                	//We only care going down. 
                	//console.log( "SLOWER DOWN!" );
                 	swapPanelImages(panelNum);
                }	
                if( (curPos > topEdge+speedDelta-200) && (curPos < bottomEdge-speedDelta) )
                {
                	retval = true; //SLOW DOWN
                }
            }
            else if( (panelNum == 2) && ((curPos > topEdge+speedDelta) && (curPos < bottomEdge-speedDelta)) )
            {
            	retval = true; //SLOW DOWN
            }
            else
            {
            	retval = false; //SPEED UP
            }
        }
        else
        {
        	//Going up.
        	var delta = curPos - getCurrentPanelEdge(curPos);
        	//console.log( "Going up -- delta:" + delta );
        	if( delta < (panelSize*.99) ) 
        	{
        		//console.log( "Going up, calling for swap: " + panelNum );
        		swapPanelImages(panelNum, true);
        	}
        	retval = false;
        }
        
        return retval;
    }
    
    /**
    * Panel Two tweaks.
    */
    function tweakPanelTwo(curPos)
    {
    	 var topEdge = panelSizes[0]*scaleFactor;
    	 var bottomEdge = topEdge + (panelSizes[1]*scaleFactor);
    	 var aThird = (bottomEdge - topEdge)/3;
    	 var spriteHeight = jQuery('#dcs_billboard_sprite').height();
    	 
    	 //console.log( "bottomEdge: " + bottomEdge + " topEdge: " + topEdge );
    	 //console.log( "curPos: " + curPos + " sprite height: " + spriteHeight);
    	 
    	 var pos = curPos + (spriteHeight/2);
    	 
    	 if( (pos < (topEdge+aThird)) ) 
    	 {
    	 	///console.log( "Panel 2, First Third" );
    	 	jQuery("#one").addClass("hover-class");
    	 	jQuery("#one div.line-img").css( 'background-image', 'url(wp-content/plugins/dcs-billboard-page/images/blue-dot.png)' );
    	 	jQuery("#two").removeClass("hover-class");
   	 		jQuery("#two div.line-img").css( 'background-image', 'url(wp-content/plugins/dcs-billboard-page/images/faded-blue-dot.png)' );
    	 	jQuery("#three").removeClass("hover-class");
    	 	jQuery("#three div.line-img").css( 'background-image', 'url(wp-content/plugins/dcs-billboard-page/images/faded-blue-dot.png)' );
 			//jQuery(".blue-line").css( { 'top' : topEdge+aThird } );
    	 }
    	 else if( (pos > (topEdge+aThird)) && (pos < (topEdge+(aThird*2))) ) 
    	 {
    	 	//console.log( "Panel 2, Second Third" );
    	 	jQuery("#one").removeClass("hover-class");
    	 	jQuery("#one div.line-img").css( 'background-image', 'url(wp-content/plugins/dcs-billboard-page/images/faded-blue-dot.png)' );
    	 	jQuery("#two").addClass("hover-class");
    	 	jQuery("#two div.line-img").css( 'background-image', 'url(wp-content/plugins/dcs-billboard-page/images/blue-dot.png)' );
    	 	jQuery("#three").removeClass("hover-class");
     	 	jQuery("#three div.line-img").css( 'background-image', 'url(wp-content/plugins/dcs-billboard-page/images/faded-blue-dot.png)' );
   	 	 	//jQuery(".blue-line").show().css( { 'top' : topEdge+aThird+(aThird/2) } );
		 }
    	 else if( (pos > (topEdge+(aThird*2))) ) 
    	 {
    	 	//console.log( "Panel 2, Third" );
    	 	jQuery("#one").removeClass("hover-class");
    	 	jQuery("#one div.line-img").css( 'background-image', 'url(wp-content/plugins/dcs-billboard-page/images/faded-blue-dot.png)' );
    	 	jQuery("#two").removeClass("hover-class");
    	 	jQuery("#two div.line-img").css( 'background-image', 'url(wp-content/plugins/dcs-billboard-page/images/faded-blue-dot.png)' );
    	 	jQuery("#three").addClass("hover-class");
			//jQuery("#three div.line-img").height( "110px" );
    	 	jQuery("#three div.line-img").css( 'background-image', 'url(wp-content/plugins/dcs-billboard-page/images/blue-dot.png)' );
    	 	//jQuery(".blue-line").show().css( { 'top' : topEdge+(2*aThird) } );
		 }
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
    function swapPanelImages(panelNum, forceIt)
    {
		if( swapState[panelNum-1] && ((forceIt === true) || ($oldPanel != panelNum)) )
		{
            //console.log( "Swapping Panel: " + panelNum );
            jQuery('img#bg-panel-'+panelNum).addClass("transparent");
            $oldPanel = panelNum;
		}
		
		if( !swapState[panelNum-1] ) 
		{
			$oldPanel = panelNum; //Record the panel number change anyway
		}
    }
    
    /**
     * Massage Current Postion 
     */
    function massageSpritePosition(curPos)
	{	
	    var winTop = $window.scrollTop();
    	var winBot = winTop + $window.height();
    	var spriteHeight = jQuery('#dcs-billboard-sprite').height();
    	var panelNum = getPanelNumber(curPos);
    	var windowPos = .85;
    	var topWinEdge = 100;
    	var botWinEdge = 120;

		//If negative or not defined, start from the starting position.
		if( isNaN(curPos) || curPos <= 0 ) 
    	{
        	curPos = topLimit;        
    	}
 
    	//If the sprite isn't being shown in the current window, put it at the windowPos mark in the window.
    	if( curPos < (winTop+topWinEdge+spriteHeight) || curPos > (winBot-botWinEdge-spriteHeight) )
    	{
    		if( panelNum == 2 ) windowPos = 0.4;
    		curPos = winTop + (($window.height()-spriteHeight)*windowPos);
    	}   	
    	
    	//If we've scrolled past the bottomLimit or the sprite somehow got painted below the
    	//bottom limit, place the sprite at the bottom limit.
    	if( winBot > bottomLimit || curPos > bottomLimit )
    	{
    		curPos = bottomLimit;
    	}
    	
    	console.log( "Massage position: " + curPos );
    	
		return curPos;
	}
	
	/**
	* Move Sprite
	*/
	function moveSprite(pos)
	{
		if( pos > bottomLimit ) return;
		console.log( "Moving sprite to: " + pos );
		jQuery('#dcs-billboard-sprite').css( { 'top' : pos } );
	}
    
}); 

/** 
 * Create HTML5 elements for IE's sake
 */
document.createElement("section");
