@extends('layouts.hero')
@section('content')

    <h1>Page: iFrame Test</h1>
    <style>iframe#ori2age{width: 1px;min-width: 100%; min-height: 100vh;}</style>
    <iframe id="ori2age" src="http://www.agecommunity.com/stats/EntityStats.aspx?loc=en-US&EntityName=Rero007&sFlag=2&md=ZS_Deathmatch" scrolling="no"></iframe>


@endsection




