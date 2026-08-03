$(cat <<'JS'
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
JS
)
