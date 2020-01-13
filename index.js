
const http = require('http');
const fs = require('fs');
const osu = require('node-os-utils');


var context = {
	green:'style="background-color:green;"'
};

const server = http.createServer(function (request, response){

	if(request.method == "GET"){
		switch(request.url){
			case '/':
				fs.readFile('./index.html',{encoding:'utf-8'},function(err,data){
					if (!err){

						osu.cpu.usage().then(cpuUsage => {

							osu.mem.info().then(memStats => {

								osu.netstat.inOut().then(netUsage => {

									osu.drive.info().then(driveStats => {
										data = data.replace('{{free_ram}}',memStats.freeMemMb);
										data = data.replace('{{used_ram}}',memStats.usedMemMb);
										data = data.replace('{{used_disk}}',driveStats.usedGb);
										data = data.replace('{{free_disk}}',driveStats.freeGb);
										data = data.replace('{{drive}}'," (" + "/" + ")");
										response.write(data);
										response.end();
									});

								});

							});

						});

					}
					else{
						console.log(err);
					}
				});
				break;

				case '/data':
					osu.cpu.usage().then(cpuUsage => {
						osu.mem.info().then(memStats => {
							osu.netstat.inOut().then(netUsage => {
								osu.drive.info().then(driveStats => {
									response.write(JSON.stringify({
										cpu:cpuUsage,
										memUsed: memStats.usedMemMb,
										memFree: memStats.freeMemMb,
										driveUsed: driveStats.usedGb,
										driveFree: driveStats.freeGb,
										net:netUsage.total
									}));
									response.end();
								});
							});
						});
					});
				break;

				default:
					response.write('<h1>The site you are looking for does not exist</h1>');
					response.end();
					break;

		}
	}
});

server.listen(8000);
console.log('listening on port 8000');
