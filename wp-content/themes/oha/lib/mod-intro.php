<!-- INTRO BEGIN -->
<?php if ( $data['bnk_intro_title'] || $data['bnk_intro_content'] || $data['bnk_intro_button'] != '' ) { ?>


<section class="home-page-intro row">
    <article class="intro">
        <header class="entry-header">
            <h2 class="entry-title vintage-type replace">
            <?php if ($data['bnk_intro_title']) { 
            	echo stripslashes($data['bnk_intro_title']); 
            } ?>
            </h2>
        </header>
        <div class="entry-content">
        
        	<?php if ($data['bnk_intro_button']) { ?>
                <p><a href="#path" class="btn danger scroll" rel="first-nav" onclick="var _gaq = _gaq || []; _gaq.push(['_trackEvent', 'Home Page CTAs', 'Intro Button']);">
                <?php echo $data['bnk_intro_button']; ?>
                </a></p>
            <?php }?>
            
            <?php if ($data['bnk_intro_content']) {
				echo '<p class="intro-content">';           
				echo stripslashes($data['bnk_intro_content']); 
				echo '</p>';           

			}?>
			
            
            
        </div>
    </article>
    <hr class="oha">
</section>	

<?php } ?>
<!-- INTRO END -->