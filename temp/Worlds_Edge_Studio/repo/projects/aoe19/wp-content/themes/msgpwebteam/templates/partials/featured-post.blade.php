<article @php(post_class('row'))>
    <div class="medium-6 columns medium-push-6">
        <img class="thumbnail" src="https://placehold.it/750x350">
    </div>
    <div class="medium-6 columns medium-pull-6">
        <h2 class="entry-title">{{ get_the_title() }}</h2>
        @include('partials/entry-meta')
        <p>@php(the_excerpt())</p>
    </div>
</article>
