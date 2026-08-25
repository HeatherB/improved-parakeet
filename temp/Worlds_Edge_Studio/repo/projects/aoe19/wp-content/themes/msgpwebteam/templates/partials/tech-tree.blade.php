<div class="techtree__item [Age] techtree__type [Item Type: Unit|Technology|Non-Technology]" 
    data-itemId="[int]" data-subtype="[Upgrade|Research]" 
    data-parentId="[int?]" data-siblingId="[int?]">
    <img src="[url]" />
    <div class="ItemNote">[string?]</div>
</div>

<style type="text/css">
    .techtree {
        &__row {
            height: 300px;
            &--stone {
                top: 75px;
            }
            &--tool {
                top: 375px;
            }
            &--bronze {
                top: 675px;
            }
            &--iron {
                top: 975px;
            }
        }
        &__item {            
            .stone {
                top: 100px; 
            }
            .tool {
                top: 400px;
            }
            .bronze {
                top: 700px;
            }
            .iron {
                top: 1000px;
            }
        }
        &__type {
            .unit {

            }
            .technology {

            }
            .non-technology {

            }
        }
    }
</style>

<script type="text/javascript">

</script>

<div id="techtree" class="techtree">
    <div class="techtree techtree__row--stone row">
    </div>
    <div class="techtree techtree__row--tool row">
    </div>
    <div class="techtree techtree__row--bronze row">
    </div>
    <div class="techtree techtree__row--iron row">
    </div>
</div>