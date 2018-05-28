$(document).ready(function () {

	StartScreen()


	function StartScreen()
	{
		$("#StartStreamBtn").show()
		$("#StopStreamBtn").show()

		$("#Title").text('http://' + 'localhost' + ':8000/index.m3u8')
	}

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