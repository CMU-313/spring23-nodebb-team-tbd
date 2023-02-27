<!-- BEGIN poll.options -->
<style>
#my_progress_bar {
    background-color: {poll.settings.color};
}
</style>
<script>
{
    let horizontal = `    
        <strong>{poll.options.title}</strong>
        <small class="pull-right">
            <a class="poll-result-votecount" href="#">
                <span>{poll.options.voteCount}</span> [[poll:votes]]
            </a>
        </small>
    <div class="progress">
            <div id="my_progress_bar" class="progress-bar poll-result-progressbar" role="progressbar" aria-valuenow="{poll.options.percentage}" aria-valuemin="0" aria-valuemax="100" style="width: {poll.options.percentage}%;">
                <span><span class="percent">{poll.options.percentage}</span>%</span>
            </div>
        </div>
    `;

    let vertical = `
        <div style="display: flex; align-items: flex-end; margin-right: 20px; float: left;">
            <div class="progress progress-bar-vertical" style="width: 20px; min-height: 100px; ">
                <div id="my_progress_bar" class="progress-bar" style="width: 20px; height: {poll.options.percentage}%; position: relative; top: calc(100% - {poll.options.percentage}%);">
                </div>
            </div><br>
            <strong>{poll.options.title}&nbsp</strong>
            <small class="">
                <a class="poll-result-votecount" href="#">
                    <span>{poll.options.voteCount}</span> [[poll:votes]]
                </a>
            </small>
        </div>
    `;

    if ({poll.settings.horizontal} == 0)
        document.getElementById('poll-content-{poll.options.id}').innerHTML = vertical;
    else 
        document.getElementById('poll-content-{poll.options.id}').innerHTML = horizontal;
}
</script>

<div class="poll-result" data-poll-option-id="{poll.options.id}">
<div id="poll-content-{poll.options.id}"></div>

</div>
<!-- END poll.options -->

