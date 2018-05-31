$(document).ready(function () {

	StartScreen()


	function StartScreen()
	{
		$("#StartStreamBtn").show()
		$("#StopStreamBtn").show()

		$("#Title").text('http://' + 'localhost' + ':8000/index.m3u8')
	}

	$('#VideoType .btn').on('click', function(event) {
		$.ajax({
		  type: "GET",
		  url: '/changeType?type=' + $(this).find('input').val()
		});
	});

	$('#VideoLength .btn').on('click', function(event) {
  		$.ajax({
		  type: "GET",
		  url: '/changeLength?length=' + $(this).find('input').val()
		});
	});

	$("#StartStreamBtn").click(function(){
		$.ajax({
		  type: "GET",
		  url: '/startStream'
		});
	});

	$("#StopStreamBtn").click(function(){
		$.ajax({
		  type: "GET",
		  url: '/stopStream'
		});
	});
 });