<div class="reveal modal large" id="modFlag" data-reveal>
    <div class="modal-inner background--paper" style="position: relative">

        <div class="modal-content flag-reason">
            <h2>Flag As Inappropriate</h2>
            <p>Please provide a reason.</p>

            <?php
                $reasons = [
                    "Offensive Content",
                    "Advertisement",
                    "Miscategorized",
                    "Inaccurate Description",
                    "Violates <a href='https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/default.aspx#o10' target='_blank'>Terms of Service</a>",
                    "Child sexual exploitation or abuse",
                    "Terrorism or violent extremism",
                    "Hate speech",
                    "Imminent harm to persons or property",
                    "Non-consensual intimate imagery",
                    "Extreme violence or gore",
                    "Nudity or pornography",
                    "Self-harm or suicide",
                    "Harassment or bullying",
                    "Defamation, impersonation, false information",
                    "Drugs or alcohol",
                    "Profanity"
                ];
            ?>

            <ul class="unstyled flag-reason__list">
                @foreach($reasons as $reason)
                    <?php  
                        $id = strip_tags($reason);
                        $id = str_replace(' ','', $id); 
                    ?>

                    <li>
                        <input type="checkbox" data-answer="{{strip_tags($reason)}}" class="standard"
                                name="Reasons"
                                id="{{$id}}"
                                tabindex="0"/>
                        <label for="{{$id}}"></label>
                        <span>{!!$reason!!}</span>
                    </li>
                @endforeach
                
                <li>
                    <input type="checkbox" data-answer="other" class="standard"
                            name="Reasons"
                            id="ReasonsOther"
                            tabindex="3"/>
                    <label for="ReasonsOther"></label>
                    <span>Other:</span>
                </li>
                <li>
                    <input type="text" name="Reasons_other" id="other" class="standard other_input" maxlength="50" disabled value="">
                </li>
            </ul>

            <div class="error_msg"></div>
            

            <button type="submit" class="btn-aoe btn-aoe--small js-button flag-inappropriate" data-button-flag>Continue</button>

            <button type="submit" data-close aria-label="Cancel" class="btn-aoe btn-aoe--small btn-aoe--gold js-button js-save js-cancel">Cancel</button>
        </div>

        <button class="close-button btn-close" data-close aria-label="Close modal" type="button"></button>
    </div>
</div>
