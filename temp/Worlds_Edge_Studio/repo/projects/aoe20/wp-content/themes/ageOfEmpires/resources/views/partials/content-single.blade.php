<div class="page-container">

    <article class="article article-layout">
        <header class="article__header">
            <h2 class="article__title">{{ get_the_title() }}</h2>
            @include('partials/entry-meta')
        </header>

        <div class="article__body">
            @php the_content() @endphp
        </div>

        @php comments_template('/partials/comments.blade.php') @endphp

        <aside class="sidebar related-articles">
            <h3 class="sidebar__header">Related Articles</h3>
            @include ('partials.content-post')
        </aside>
    </article>

</div>
