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

## Tentativa dois

### Factorio incremental

Jogo incremental sobre coletar recursos e transformar esses recursos em outras coisas.
Vamos seguir as receitas já existentes no factorio. Porém começando com os mais básicos.

Deverá haver um elemento na tela para cada tipo de recurso.
O jogador poderá clicar em um recurso para coletar ele manualmente.
Só podemos coletar um recurso por vez.

Logo depois teremos os extratores que utilizam carvão.
Eles vão utilizar o carvão para extrair o recurso.

Realizei uma tentativa de adicionar armazenamentos para os recursos.
Será de lá que pegarei recursos para construir as fábricas.
Porém não estou satisfeito com a organização do sistema, talvez o uso de classes
dessa forma não seja o ideal, talvez haja uma forma melhor de conectar as coisas.

Definitivamente já quero muito uma forma de automatizar os recursos
a primeira deverá ser a furnace, para poder produzir as placas de ferro
necessárias para a criação das montadoras

#### Recursos iniciais

- Carvão
- Ferro
- Cobre
- Pedra

#### Recursos secundários

- placa de ferro
- placa de cobre
- catracas
- fio de cobre

#### Fabricas

Produzem recursos secundários

- Furnace
- Montadora
