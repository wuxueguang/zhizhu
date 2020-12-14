
const type = arr => /^\[object (.*)\]/.exec(Object.prototype.toString.call(arr))[1].toLowerCase();

const styleStr = styleObj => Object.keys(styleObj).reduce((styleStr, name) => (
	styleStr + `${name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}:${styleObj[name]};`
), '');

const log = function(...args) {
	if (type(args[0]) === 'string') {
		console.log(...[`%c${args[0]}`, this.style, ...args.slice(1)]);
	} else {
		if (type(args[0]) === 'object' && args[0].isLogStyle) {
			Object.assign(this.styleObj, args[0]);
			this.style = styleStr(this.styleObj);
			args.length > 1 && this.apply(this, args.slice(1));
		} else {
			console.log(...args);
		}
	}
};

log.styleObj = {
	color: '#0f0',
	background: '#000',
	fontWeight: 'bold',
	fontSize: '12px'
};

log.style = styleStr(log.styleObj);

export default log.bind(log);