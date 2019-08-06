function MockResponse() : any {
	const res : any = {};
	let JSONRes : any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockImplementation((json : any) : any => {
		JSONRes = json;
		return res;	
	});
	res.send = jest.fn().mockReturnValue(res);
	res.getJSON = () : any => JSONRes;
	return res;
}

export default MockResponse;