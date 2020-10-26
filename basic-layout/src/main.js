
import React, { useState, useEffect } from 'react';
import { Input, DatePicker } from 'antd';


export default () => {

	const [flag, setFlag] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setFlag(!flag);
		}, 1000);
	}, [flag]);

	return flag ? (
		<Input />
	) : (
		<DatePicker />
	);
};

