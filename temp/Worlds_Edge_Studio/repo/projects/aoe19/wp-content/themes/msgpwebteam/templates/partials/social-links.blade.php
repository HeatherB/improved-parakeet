<?php //this should be in database
    $socialLinks = array(
        array(
            "name" => "Facebook",
            "url" => "https://www.facebook.com/ageofempires/"
        ),
        array(
            "name" => "Instagram",
            "url" => "https://www.instagram.com/ageofempiresgame/"
        ),
        array(
            "name" => "Twitter",
            "url" => "https://twitter.com/ageofempires"
        ),
        array(
            "name" => "Discord",
            "url" => "https://discord.gg/ageofempires"
        ),
        array(
            "name" => "YouTube",
            "url" => "https://www.youtube.com/ageofempires"
        )
    );
?>

<ul class="social">
    @foreach ($socialLinks as $socialLink)
        <li>
            <a class="social__link icon--{{strtolower($socialLink['name'])}}" href="{{$socialLink['url']}}" title="{{$socialLink['name']}}">
                <span class="visually-hidden">{{$socialLink['name']}}</span>
            </a>
        </li>
    @endforeach
</ul>