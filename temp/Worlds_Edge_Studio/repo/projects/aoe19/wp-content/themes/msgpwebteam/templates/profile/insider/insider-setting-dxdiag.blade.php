<div class="insider_block" id="insiderSettingDxDiag">
    <span class="title">
        <div class="flex_container spaced">
            <span
              class="title_name flex_item  <?php echo ($hasDxDiag && $hasPCSpecs) ? 'complete' : 'incomplete' ?>">DXDIAG</span>
            <?php if(!empty($diag_date)){ ?>
                <div
                  class="date_label flex_item">Updated: <?php echo date('m/d/y', $diag_date); ?></div>
            <?php } else { ?>
                <span class="flex_item tooltip_icon"
                      tabindex="1" data-tooltip
                      title="A green checkmark icon indicates completed information. A red exclamation icon indicates pending, or incomplete information."></span>
            <?php } ?>
        </div>
    </span>
    <div class="insider_content">
      <button type="button" class="btn-aoe btn-aoe--small js-button js-insiders_modal update_dxdiag_btn">Update DxDiag</button>
      <?php if($hasDxDiag) { ?>
        <button type="button" class="btn-aoe btn-aoe--small btn-aoe--gold js-button js-insiders_modal remove_dxdiag_btn">Remove DxDiag</button>
      <?php } ?>
    </div>
</div>
