<div class="section-divider section--padding background--rock">
    <div class="row">
        <div class="column small-12 medium-12">
            {{the_content()}}
        </div>
    </div>
</div>

<div class="section-divider section--padding background--paper">
    <div class="row">
        <div class="column small-12 medium-12">
            <form action="<?php the_permalink(); ?>" id="vcmForm" method="post">
              <label>
                <span>Enter your email</span>
                <input type="text" name="email" id="email" />
              </label>
              <button type="submit" id="submit-vcm">Apply Now</button>
            </form>
        </div>
    </div>
</div>