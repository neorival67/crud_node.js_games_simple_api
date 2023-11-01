	import http from 'http';
	import data from './data.js';


	const requestListener = (req, res ) => {
		const method = req['method'];
		const url = req.url.split('/')[1];
		const params = req.url.split('/'[2]);

		res.setHeader('Content-Type', 'application/json' );
		
		if (method == 'GET' ) {
			switch (url) {
				case 'games' :
					const responseJSON = {
						message : 'data games berhasil ditemukan',
						data: data,
					};
				res.end(JSON.stringify(responseJSON));
				break;
			}
		};
		// get end

		if (method == "POST") {
			let requestBody = '';
			req.on('data',(m) =>{
					requestBody += m ;
					console.log(requestBody);		
				});

				switch (url) {
					case 'games':
					  let requestBody = '';
				  
					  req.on('data', (m) => {
						// Accumulate the request data
						requestBody += m;
					  });
				  
					  req.on('end', () => {
						try {
						  const parsedData = JSON.parse(requestBody);
						  data.push(parsedData);
				  
						  const responseJSON = {
							message: 'Data berhasil diinput',
							data: data,
						  };
				  
						  res.setHeader('Content-Type', 'application/json');
						  res.end(JSON.stringify(responseJSON));
						} catch (error) {
						  console.error("Error parsing JSON:", error);
						  res.statusCode = 400; // Bad Request status code
						  res.end(JSON.stringify({ error: 'Invalid JSON' }));
						}
					  });
				  
					  break;
				}
		}
		// post end

		if (method == 'PUT') {
			let requestBody = '';
			req.on('data', (m) => {
				requestBody += m;
				console.log(requestBody);
			});	
			switch (url) {
				case 'games' :
					req.on('end', () =>{
						requestBody = JSON.parse(requestBody);

						const dataFind = data.filter((data) =>data.kode === params );
						if (dataFind.length < 0 ) {
							res.statusCode = 404;
							return res.end(JSON.stringify({
								message : 'data games tidak ditemukan',
							}));
						} 
						else {
							res.statusCode = 200;
							return res.end(JSON.stringify({
								message : 'data games berhasil diperbarui',
							}));
						}
					});
					break;
			}
		}
		// put end
		if(method == 'DELETE') {
			switch (url) {
				case 'games' :
					const index = data.findIndex((data) =>{
						data.kode == params ;
				});

				data.splice(index, 1);
				if (index == 'games'){
					res.statusCode = 404;
							return res.end(JSON.stringify({
								message : 'data tidak ditemukan',
					}));
				}
				else {
					res.statusCode = 200;
					return res.end(JSON.stringify({
						message : 'data berhasil dihapus',
					}));
					break;
				}
			}
		}
	};
	const app = http.createServer(requestListener);

	const port = 3000;
	app.listen(port, ()=>{
		console.log(`Server running on port ${port}`);
	});
