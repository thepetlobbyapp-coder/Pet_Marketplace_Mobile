/**
 * Conventional Commits — ver COMMITS.md
 * Ativar com commitlint + husky em bloco posterior, se desejado.
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      [
        'back',
        'mobile',
        'admin',
        'docs',
        'codex',
        'infra',
        'bloco0',
        'bloco1',
        'bloco2',
        'bloco3',
        'bloco4',
        'bloco5',
        'bloco6',
        'bloco7',
        'bloco8',
        'bloco9',
        'bloco10',
        'bloco11',
      ],
    ],
  },
};
