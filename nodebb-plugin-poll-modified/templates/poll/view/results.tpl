<!-- BEGIN poll.options -->
<div class="poll-result" data-poll-option-id="{poll.options.id}">
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
</div>
<!-- END poll.options -->

<style>
#my_progress_bar {
    background-color: {poll.settings.color};
}
</style>