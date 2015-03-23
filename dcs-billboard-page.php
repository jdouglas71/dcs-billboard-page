<?php 
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
/**
 * Plugin Name: DCS Billboard Page
 * Description: Defines a page as a set of "billboard" panels with a counter scrolling sprite in the foreground. i
 * As the sprite scrolls past the panel, they update their image using a crossfade. 
 * Currently specific to the TouchJet website but eventually will be genericized.
 * Author: Jason Douglas
 * Version: 0.2
 * License: GPL2
 */

/**
 * Enqueue css and js files.
 */
function dcs_billboard_page_load_scripts()
{
    //JGD TODO: Register for specific page only.
    wp_register_style( 'dcs_billboard_page_style', plugin_dir_url(__FILE__).'dcs-billboard-page.css' );
    wp_enqueue_style( 'dcs_billboard_page_style' );

    wp_register_script( 'dcs_billboard_page_script', plugin_dir_url(__FILE__).'dcs-billboard-page.js', array('jquery') );
}
add_action( 'enqueue_scripts', 'dcs_billboard_page_load_scripts' );

/**
 * Short code for the billboard page.
 */ 
function dcs_billboard_page_shortcode($atts, $content=null)
{
    extract( shortcode_atts( array( ), $atts ) );
    $retval = "Jason was here";
    
    $retval .= dcs_billboard_page_getPanel( 1 );
    $retval .= dcs_billboard_page_getPanel( 2 );
    $retval .= dcs_billboard_page_getPanel( 3 );
    $retval .= dcs_billboard_page_getPanel( 4 );
    $retval .= dcs_billboard_page_getPanel( 5 );
    $retval .= dcs_billboard_page_getPanel( 6 );
    $retval .= dcs_billboard_page_getPanel( 7 );
    return $retval;
}
add_shortcode( 'dcs_billboard_page', 'dcs_billboard_page_shortcode' );

/**
 * Central Panel Code Getter
 */
function dcs_billboard_page_getPanel($index)
{
    $retval = "";

    return $retval;
}

