function cls()
{
	document.querySelector('input').value="0";
	op='+';
	deci=0;
	fInput=0;
	opstring="";
    input = [];
    postfixStack = [];
    evaluateStack = [];
    operatorStack = [];
}

/*
a. implement Shunting Yard algorithm.
b. implement UI parsing by continuous parsing.
c. Integrate UI with Shunting Yard.
1. while the input does not recieve = sign.
2. if token is a number. place into output queue.
3. a function, push it onto operator stack.
4. an operator o1,
    while ( there is an operator other than a left parenthesis on the top of the stack o2 
        and o2 has greater precedence than o1 or (precedence(o1) = precedence(o2)
            and o1 is left-associative))
        pop o2 from output stack into  output queue.
    push o1 onto operator stack.
5. a left parenthesis
        push onto operator stack.
6. a right parenthesis.
        while the operator at the top of the stack is not a left parenthesis:
            pop operator from top of stack to operator queue.
        pop left parenthesis at the top of the stack and discard it.
7. while there are tokens on the operator stack.
        pop the tokens and push them on the output queue.

*/
var operatorStack = [];
var operators = [
    {
        'operator' : 'x',
        'precedence' : 3,
        'associativity' : 'Left',
    },
    {
        'operator' : '/',
        'precedence' : 3,
        'associativity' : 'Left',
    },
    {
        'operator' : '+',
        'precedence' : 2,
        'associativity' : 'Left',
    },
    {
        'operator' : '-',
        'precedence' : 2,
        'associativity' : 'Left',
    }
];
const numericRegex = /[0-9]+/;
const operatorRegex = /^(\+|-|\x|\/)$/;
//Shunting-Yard Algorithm.
function infixToPostfix(input) {
    operatorStack = [];
    postfixStack = [];
    while (input.length > 0) {
        const inputCharacter = input.pop();
        if (inputCharacter === '=') {
            continue ;
        } else if (('' + inputCharacter).match(new RegExp(numericRegex))) {
            postfixStack.push(inputCharacter);
        } else if ((''+ inputCharacter).match(new RegExp(operatorRegex))) {
            const inputOperatorIndex = operators.findIndex(operatorObject => {
                return operatorObject.operator === inputCharacter;
            });
            
            while (operatorStack.length > 0) {
                const stackOperator = operatorStack[operatorStack.length - 1];
                if (stackOperator === '(') {
                    break;
                }
                const stackOperatorIndex = operators.findIndex(operatorObject => {
                    return operatorObject.operator === stackOperator;
                });
                
                if (operators[stackOperatorIndex].precedence > operators[inputOperatorIndex].precedence
                    || (operators[stackOperatorIndex].precedence === operators[inputOperatorIndex].precedence
                        && operators[inputOperatorIndex].associativity === 'Left')) {
                    postfixStack.push(operatorStack.pop());
                }
            }
            operatorStack.push(inputCharacter);
        } else if (inputCharacter === '(') {
            postfixStack.push(inputCharacter);
        } else if (inputCharacter === ')') {
            do {
                if (operatorStack.length === 0) {
                    console.log('Invalid operation.');
                    break;
                }
                const popped = operatorStack.pop();
                if (popped === '(') {
                    break;
                }
                postfixStack.push(popped);
            } while (true);
        } else {
            console.log('Error Invalid operator');
        }
    }
    while (operatorStack.length > 0) {
        postfixStack.push(operatorStack.pop());
    }
    return postfixStack;
}
function evaluate(postFixStack) {
    var evaluateStack = [];
    for (var i=0;i<postFixStack.length; i++) {
        const operator = postFixStack[i];
        if (('' + operator).match(new RegExp(numericRegex))) {
            evaluateStack.push(operator);
        } else if (('' + operator).match(new RegExp(operatorRegex))) {
            const op1 = evaluateStack.pop();
            const op2 = evaluateStack.pop();
            switch (operator) {
                case 'x' : evaluateStack.push(op1*op2); break;
                case '/' : evaluateStack.push(op1/op2); break;
                case '+' : evaluateStack.push(op1+op2); break;
                case '-' : evaluateStack.push(op1-op2); break;
            }
        }
    }
    return evaluateStack[0];
}
var input = [];
function addInput(inputOp) {
    if ((inputOp).match(new RegExp(operatorRegex))) {
        input.push(Number(document.getElementById('inputBar').value));
        input.push(inputOp);
        document.getElementById('inputBar').value = '';
        return;
    }
    if (inputOp !== '=') {
        document.getElementById('inputBar').value = document.getElementById('inputBar').value 
        + '' + inputOp;
        return;
    }
    input.push(Number(document.getElementById('inputBar').value));
    input.push('=');
    document.getElementById('inputBar').value = evaluate(infixToPostfix(input));
}
document.addEventListener('keypress', function onEvent(e) {
    if (e.defaultPrevented) {
        return ;
    }
    if (e.key === '=' || (e.key).match(new RegExp(numericRegex)) || (e.key).match(new RegExp(operatorRegex))) {
        addInput(e.key);
        document.getElementById('inputBar').innerHTML += e.key;
    }
});


// Test 1: Complex function : 1+2x3 = 7
input = [1,'+', 2,'x',3];
console.assert(evaluate(infixToPostfix(input)) === 7);
input = [1,'x', 2,'x',3];
console.assert(evaluate(infixToPostfix(input)) === 6);
input = [1,'x', 2,'/',3];
console.assert(evaluate(infixToPostfix(input)) >= 0.6);
input = [];
// input = [1,'x','(',2,'+',3, ')'];
// console.assert(evaluate(infixToPostfix(input)) === 5);
