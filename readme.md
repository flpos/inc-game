# Incremental Games

Ambiente de testes para criar jogos incrementais, ou fazer pequenos protótipos,
ou qualquer coisa que saia.

## Primeira vez

Comecei estabelecendo uma estrutura básica para o loop, depois de uma tentativa
estrana usando setTimeout pesquisei sobre e o google me trouxe o `requestAnimationFrame`
implementei o loop com ele.

Depois disso foi a criação das classes básicas, com um render que praticamente cria um botão
com as informações de cada "trabalhador".

A classe Counter foi onde explorei a ideia de executar "uma ação por segundo" dentro do loop
aí criei as classes "trabalhadoras" usando esse conceito e flexibilizando o intervalo

Por fim fiz o método (mega simples né) para mudar o recurso global, retornando um boleano
indicando se a transação pode ser feita ou não.
