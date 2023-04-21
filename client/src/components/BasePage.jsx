const { Container } = require('@mui/material');
const { styled } = require('@mui/system');

const BasePage = styled(Container)({
	minWidth: '800px',
	maxWidth: '1000px',
	// paddingLeft: '5rem !important',
	// paddingRight: '5rem !important',
});

export default BasePage;
