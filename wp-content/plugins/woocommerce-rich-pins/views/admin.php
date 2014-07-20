<?php

/**
 * Represents the view for the administration dashboard.
 *
 * This includes the header, options, and other information that should provide
 * The User Interface to the end user.
 *
 * @package    WCRP
 * @subpackage Views
 * @author     Phil Derksen <pderksen@gmail.com>, Nick Young <mycorpweb@gmail.com>
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $wcrp_options;

?>

<div class="wrap">

	<div id="wcrp-settings">
		<div id="wcrp-settings-content">
			<h2><?php echo esc_html( get_admin_page_title() ); ?></h2>

			<div id="container">

				<form method="post" action="options.php">
					<?php
						
						settings_fields( 'wcrp_settings_license' );
						do_settings_sections( 'wcrp_settings_license' );
						
						settings_fields( 'wcrp_settings_general' );
						do_settings_sections( 'wcrp_settings_general' );
					
						submit_button();
					?>
				</form>
			</div><!-- #container -->

		</div><!-- #wcrp-settings-content -->
	</div>

</div><!-- .wrap -->
